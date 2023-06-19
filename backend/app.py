import threading
import time
from datetime import datetime
import os
from repositories.DataRepository import DataRepository
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from RPi import GPIO
from helpers.BH1750 import BH1750
from helpers.SGP30 import SGP30
from helpers.DHT20 import DHT20
from helpers.lcd import LCD
from helpers.Stappenmotor import Stappenmotor
from subprocess import check_output

bh1750 = BH1750(0x23)
sgp30 = SGP30(0x58)
dht20 = DHT20(0x38)
lcd = LCD(17, 22, 27)
motor_deur = Stappenmotor(12, 16, 20, 21)
motor_voer = Stappenmotor(6, 13, 19, 26)

pushButtonLuik = 23
pushButtonVoer = 25
togglePowerButton = 18

status_knop_luik = 0
status_knop_voer = 0

lichtintensiteit = None
eCO2 = None
TVOC = None
temperatuur = None
luchtvochtigheid = None


def toonOpLCD():
    lcd.send_instruction(0b00000001)  # wis het scherm
    # Haal de ip adressen op, split ze per ip
    byte_ips = check_output(['hostname', '-I'])
    ips = byte_ips.decode("utf-8")
    adresses = ips.split()[0]
    print(adresses)
    # stuur op de eerste lijn de 1e ip
    if len(adresses) >= 1:
        lcd.write_message(adresses)
    # selecteer de 2de lijn en zend de 2de ip
    if len(adresses) >= 2:
        lcd.send_instruction(0b11000000)
        lcd.write_message('Search ip -> app')


def pushButtonLuik_callback(channel):
    global status_knop_luik
    # if GPIO.input(channel) == 1:
    status_knop_luik = 1
    # print("LUIK")


def pushButtonVoer_callback(channel):
    global status_knop_voer
    # if GPIO.input(channel) == 1:
    status_knop_voer = 1
    # print("VOER")


def togglePowerButton_callback(channel):
    print("System shutting down...")
    lcd.init_LCD()
    lcd.write_message("System shutdown!")
    os.system("sudo shutdown now")


def setup():
    toonOpLCD()
    GPIO.setmode(GPIO.BCM)
    # GPIO.setup([pushButtonLuik, pushButtonVoer], GPIO.IN, GPIO.PUD_UP)
    GPIO.setup(pushButtonLuik, GPIO.IN, GPIO.PUD_UP)
    GPIO.setup(pushButtonVoer, GPIO.IN, GPIO.PUD_UP)
    GPIO.setup(togglePowerButton, GPIO.IN, GPIO.PUD_UP)

    GPIO.add_event_detect(pushButtonLuik, GPIO.FALLING,
                          pushButtonLuik_callback, bouncetime=200)
    GPIO.add_event_detect(pushButtonVoer, GPIO.FALLING,
                          pushButtonVoer_callback, bouncetime=200)
    GPIO.add_event_detect(togglePowerButton, GPIO.BOTH,
                          togglePowerButton_callback, bouncetime=200)


def run_hardware():
    global status_knop_luik, status_knop_voer, modus, settings
    setup()
    settings = DataRepository.read_config(1)
    modus = settings["Modus"]
    data = DataRepository.read_last_device_history(4)
    status_luik = data['ActieId']
    tijdnu = (
        f"{datetime.fromtimestamp(time.time()).strftime('%H')}:{datetime.fromtimestamp(time.time()).strftime('%M')}")
    executed_once_open = False
    executed_once_close = False
    executed_once_feed = False
    reset_var_last_run = time.time()
    while True:
        now = time.time()
        modus = settings["Modus"]
        if (reset_var_last_run + 61 <= now):
            executed_once_open = False
            executed_once_close = False
            executed_once_feed = False
            reset_var_last_run = now

        # print(settings)
        tijdnu = (
            f"{datetime.fromtimestamp(time.time()).strftime('%H')}:{datetime.fromtimestamp(time.time()).strftime('%M')}")
        if modus == 1:
            # print(settings)
            # print('manual mode')
            if settings["OpenTijd"] == tijdnu and not executed_once_open:
                print('Open de deur - manual')
                status_knop_luik = 1
                executed_once_open = True
            elif settings["SluitTijd"] == tijdnu and not executed_once_close:
                print('Sluit de deur - manual')
                status_knop_luik = 1
                executed_once_close = True
        if settings["VoederTijd"] == tijdnu and not executed_once_feed:
            print('Geef voer')
            status_knop_voer = 1
            executed_once_feed = True

        if modus == 0:
            # print('auto mode')
            if lichtintensiteit > 2000 and not executed_once_open and status_luik != 10:
                print(lichtintensiteit)
                print('Open de deur - auto')
                status_knop_luik = 1
                executed_once_open = True
            if lichtintensiteit < 50 and not executed_once_close and status_luik != 11:
                print(lichtintensiteit)
                print(status_luik)
                print('Sluit de deur - auto')
                status_knop_luik = 1
                executed_once_close = True

        if status_knop_luik == 1:
            DataRepository.add_history(
                device_id=2, actie_id=6, waarde=1, commentaar="Pushbutton luik bedienen ingedrukt")
            data = DataRepository.read_last_device_history(4)
            status_luik = data['ActieId']

            if status_luik == 10:
                print("De deur gaat DICHT")
                DataRepository.add_history(
                    device_id=4, actie_id=11, waarde=0, commentaar="Het luik werd gesloten")
                socketio.emit('B2F_new_timeline')
                lcd.send_instruction(0b00000001)
                lcd.write_message("Door closing ...")
                motor_deur.draai(-4700, 0.001)
                socketio.emit('B2F_current_door_icon', {'status': 'closed'})
                status_luik = 0
            if status_luik == 11:
                print("De deur gaat OPEN")
                DataRepository.add_history(
                    device_id=4, actie_id=10, waarde=0, commentaar="Het luik werd geopend")
                socketio.emit('B2F_new_timeline')
                lcd.send_instruction(0b00000001)
                lcd.write_message("Door opening ...")
                motor_deur.draai(7000, 0.001)
                socketio.emit('B2F_current_door_icon', {'status': 'opened'})
                status_luik = 0
            status_knop_luik = 0
            toonOpLCD()

        if status_knop_voer == 1:
            DataRepository.add_history(
                device_id=11, actie_id=12, waarde=1, commentaar="Pushbutton voer bedienen ingedrukt")
            socketio.emit('B2F_new_timeline')
            print("Er wordt voer gegeven")
            lcd.send_instruction(0b00000001)
            lcd.write_message("Grain dispensing...")
            motor_voer.draai(-1000, 0.001)
            DataRepository.add_history(
                device_id=5, actie_id=2, waarde=1, commentaar="Er werd 1 portie voer gegeven")
            status_knop_voer = 0
            toonOpLCD()


# Custom endpoint
ENDPOINT = '/api/v1'

app = Flask(__name__)
app.config['SECRET_KEY'] = 'HELLOTHISISSCERET'

# ping interval forces rapid B2F communication
socketio = SocketIO(app, cors_allowed_origins="*",
                    async_mode='gevent', ping_interval=0.5)
CORS(app)


# # START een thread op. Belangrijk!!! Debugging moet UIT staan op start van de server, anders start de thread dubbel op
# # werk enkel met de packages gevent en gevent-websocket.
def read_sensors():
    global lichtintensiteit, eCO2, TVOC, temperatuur, luchtvochtigheid
    lichtintensiteit = bh1750.lux
    eCO2 = sgp30.eCO2
    TVOC = sgp30.TVOC
    temperatuur = dht20.Temperatuur
    luchtvochtigheid = dht20.Humidity
    # socketio.emit('B2F_new_sensor_values', {
    #             'lichtintensiteit': lichtintensiteit, 'eCO2': eCO2, 'TVOC': TVOC, 'temperatuur': temperatuur, 'luchtvochtigheid': luchtvochtigheid})
    # wait 10s with sleep sintead of threading.Timer, so we can use daemon
    time.sleep(10)
    toonOpLCD()
    read_sensors_last_run = time.time()
    while True:
        now = time.time()
        lichtintensiteit = bh1750.lux
        eCO2 = sgp30.eCO2
        TVOC = sgp30.TVOC
        temperatuur = dht20.Temperatuur
        luchtvochtigheid = dht20.Humidity
        if (read_sensors_last_run + 10 <= now):
            DataRepository.add_history(
                device_id=6, actie_id=5, waarde=lichtintensiteit, commentaar=None)
            DataRepository.add_history(
                device_id=7, actie_id=8, waarde=eCO2, commentaar=None)
            DataRepository.add_history(
                device_id=8, actie_id=9, waarde=TVOC, commentaar=None)
            DataRepository.add_history(
                device_id=9, actie_id=3, waarde=temperatuur, commentaar=None)
            DataRepository.add_history(
                device_id=10, actie_id=4, waarde=luchtvochtigheid, commentaar=None)
            socketio.emit('B2F_new_sensor_values', {
                'lichtintensiteit': lichtintensiteit, 'eCO2': eCO2, 'TVOC': TVOC, 'temperatuur': temperatuur, 'luchtvochtigheid': luchtvochtigheid})
            read_sensors_last_run = now


def start_thread():
    # threading.Timer(10, all_out).start()
    t = threading.Thread(target=read_sensors, daemon=True)
    t.start()
    k = threading.Thread(target=run_hardware, daemon=True)
    k.start()
    print("thread reading sensors started")


# API ENDPOINTS
@app.route('/')
def hallo():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."


@app.route(ENDPOINT + '/devices/', methods=['GET'])
def get_devices():
    data = DataRepository.read_all_devices()
    return jsonify(data), 200


@app.route(ENDPOINT + '/devices/<id>/', methods=['GET'])
def get_device_by_id(id):
    data = DataRepository.read_history_by_deviceid(id)
    return jsonify(data), 200


@app.route(ENDPOINT + '/timeline/', methods=['GET'])
def get_timeline_history():
    data = DataRepository.read_history_timeline()
    return jsonify(data), 200


@app.route(ENDPOINT + '/config/<user_id>/', methods=['GET'])
def get_config(user_id):
    data = DataRepository.read_config(user_id)
    return jsonify(data), 200

# @app.route(ENDPOINT + '/devices/<id>/details/', methods=['GET'])
# def get_device_details(id):
#     data = DataRepository.read_device_details(id)
#     return jsonify(data), 200

# SOCKET IO


@socketio.on('connect')
def initial_connection():
    global lichtintensiteit, eCO2, TVOC, temperatuur, luchtvochtigheid
    print('A new client connect')
    socketio.emit('B2F_new_sensor_values', {'lichtintensiteit': lichtintensiteit, 'eCO2': eCO2,
                  'TVOC': TVOC, 'temperatuur': temperatuur, 'luchtvochtigheid': luchtvochtigheid})
    data = DataRepository.read_last_device_history(4)
    laatste_status_deur = data["ActieId"]
    if laatste_status_deur == 10:
        socketio.emit('B2F_current_door_icon', {'status': 'opened'})
    if laatste_status_deur == 11:
        socketio.emit('B2F_current_door_icon', {'status': 'closed'})
    # # Send to the client!
    # vraag alle devices op uit de db
    # devices = DataRepository.read_all_devices()
    # emit('B2F_connected', {'devices': devices})
    # Beter is het om enkel naar de client te sturen die de verbinding heeft gemaakt.
    # emit('B2F_status_lampen', {'lampen': status}, broadcast=False)


@socketio.on('F2B_toggle_motor')
def control_motor(data):
    global status_knop_voer, status_knop_luik
    print('Een motor wordt aangestuurd:', data)
    motor_id = data['buttonId']
    if motor_id == 'feeder':
        status_knop_voer = 1
    elif motor_id == 'door':
        status_knop_luik = 1


@socketio.on('F2B_new_config')
def change_config(dict_settings):
    global settings
    if dict_settings['Modus'] == 'Manual':
        print('manueel')
        dict_settings['Modus'] = 1
        DataRepository.update_config_full(dict_settings['user'], dict_settings['Modus'],
                                          dict_settings['OpenTijd'], dict_settings['SluitTijd'], dict_settings['VoederTijd'])
    if dict_settings['Modus'] == 'Auto':
        dict_settings['Modus'] = 0
        # print(dict_settings['VoederTijd'])
        print('auto')
        DataRepository.update_config_small(
            dict_settings['user'], dict_settings['Modus'], dict_settings['VoederTijd'])
        dict_settings['OpenTijd'] = ''
        dict_settings['SluitTijd'] = ''
    settings = dict_settings
    print(settings)
    socketio.emit('B2F_config_update')


@socketio.on('F2B_system_shutdown')
def power_off():
    togglePowerButton_callback('app')


if __name__ == '__main__':
    try:
        start_thread()
        print("**** Starting APP ****")
        socketio.run(app, debug=False, host='0.0.0.0')
    except KeyboardInterrupt:
        print('KeyboardInterrupt exception is caught')
    finally:
        print("finished")
        GPIO.cleanup()
