import threading
import time
from datetime import datetime
from repositories.DataRepository import DataRepository
from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from helpers.BH1750 import BH1750
from helpers.SGP30 import SGP30
from helpers.DHT20 import DHT20
from helpers.lcd import LCD

bh1750 = BH1750(0x23)
sgp30 = SGP30(0x58)
dht20 = DHT20(0x38)
lcd = LCD(17,22,27)


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
    # wait 10s with sleep sintead of threading.Timer, so we can use daemon
    time.sleep(10)
    read_sensors_last_run = time.time()
    while True:
        now = time.time()
        lichtintensiteit = bh1750.lux
        eCO2 = sgp30.eCO2
        TVOC = sgp30.TVOC
        temperatuur = dht20.Temperatuur
        luchtvochtigheid = dht20.Humidity
        if read_sensors_last_run + 10 <= now:
            DataRepository.add_history(device_id=6,actie_id=5,waarde=lichtintensiteit, commentaar=None)
            DataRepository.add_history(device_id=7,actie_id=8,waarde=eCO2, commentaar=None)
            DataRepository.add_history(device_id=8,actie_id=9,waarde=TVOC, commentaar=None)
            # print('*** We zetten alles uit **')
            # DataRepository.update_status_alle_lampen(0)
            # GPIO.output(ledpin, 0)
            # status = DataRepository.read_status_lampen()
            # socketio.emit('B2F_alles_uit', {
            #     'status': "lampen uit"})
            # socketio.emit('B2F_status_lampen', {'lampen': status})
            read_sensors_last_run = now


def start_thread():
    # threading.Timer(10, all_out).start()
    t = threading.Thread(target=read_sensors, daemon=True)
    t.start()
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

# SOCKET IO


@socketio.on('connect')
def initial_connection():
    print('A new client connect')
    # # Send to the client!
    # vraag alle devices op uit de db
    devices = DataRepository.read_all_devices()
    emit('B2F_connected', {'devices': devices})
    # Beter is het om enkel naar de client te sturen die de verbinding heeft gemaakt.
    # emit('B2F_status_lampen', {'lampen': status}, broadcast=False)


# @socketio.on('F2B_switch_light')
# def switch_light(data):
#     print('licht gaat aan/uit', data)
#     lamp_id = data['lamp_id']
#     new_status = data['new_status']
#     # spreek de hardware aan
#     # stel de status in op de DB
#     res = DataRepository.update_status_lamp(lamp_id, new_status)
#     print(res)
#     # vraag de (nieuwe) status op van de lamp
#     data = DataRepository.read_status_lamp_by_id(lamp_id)
#     socketio.emit('B2F_verandering_lamp',  {'lamp': data})
#     # Indien het om de lamp van de TV kamer gaat, dan moeten we ook de hardware aansturen.
#     if lamp_id == '3':
#         print(f"TV kamer moet switchen naar {new_status} !")
#         # Do something


if __name__ == '__main__':
    try:
        start_thread()
        print("**** Starting APP ****")
        socketio.run(app, debug=False, host='0.0.0.0')
    except KeyboardInterrupt:
        print('KeyboardInterrupt exception is caught')
    finally:
        print("finished")
