from RPi import GPIO
from smbus import SMBus
import time

class LCD:
        #bij het aanmaken, stel je de parameters in
        def __init__(self, rs_pin, e_pin, rw_pin):
            self.rs_pin = rs_pin
            self.e_pin = e_pin
            self.rw_pin = rw_pin
            
            #open de i2c bus
            self.i2c = SMBus()
            self.i2c.open(1)
            
            #doe de setup en initialiseer de LCD
            self.setup()
            self.init_LCD()
        
        def setup(self):
            #alle pinnen instellen
            GPIO.setmode(GPIO.BCM)
            GPIO.setup((self.rs_pin, self.e_pin, self.rw_pin), GPIO.OUT)
            GPIO.output(self.rw_pin, GPIO.LOW)
            
        def set_data_bits(self, byte):
            #ZONDER PCF:
            # for bit in range(8):
            #     bit_value = (byte >> bit) & 0x01
            #     if bit_value == 1:
            #         GPIO.output(self.data_pins[bit], GPIO.HIGH)
            #     else:
            #         GPIO.output(self.data_pins[bit], GPIO.LOW)

            #MET PCF:
            #stuur de waardes door op adress 0x20 van de PCF (LCD)
            self.i2c.write_byte(0x20,byte)

        def i2c_close(self):
            self.i2c.close()
                    
        def send_instruction(self, value):
            GPIO.output(self.rs_pin, GPIO.LOW)
            self.set_data_bits(value)
            GPIO.output(self.e_pin, GPIO.HIGH)
            time.sleep(0.002)
            GPIO.output(self.e_pin, GPIO.LOW)
            GPIO.output(self.rs_pin, GPIO.HIGH)

        def send_character(self, value):
            GPIO.output(self.rs_pin, GPIO.HIGH)
            self.set_data_bits(value)
            GPIO.output(self.e_pin, GPIO.HIGH)
            time.sleep(0.002)
            GPIO.output(self.e_pin, GPIO.LOW)
            GPIO.output(self.rs_pin, GPIO.LOW)

        def write_message(self, message):
            #bij het schrijven, verander de lijn nadat de 1e lijn vol is,
            #indien het niet op 2 lijnen past, scrollt het scherm
            teller = 0
            for letter in message:
                teller = teller + 1
                if teller == 17:
                    self.send_instruction(0b11000000)
                if teller > 32:
                    self.send_instruction(0b00011000)
                self.send_character(ord(letter))

        def init_LCD(self):
            self.send_instruction(0b00001100) #dispay on
            self.send_instruction(0b00111000) #function set off
            self.send_instruction(0b00000001) #clear display/cursor home