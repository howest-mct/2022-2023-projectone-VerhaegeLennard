from RPi import GPIO
import time
from smbus import SMBus


class LCD():
    def __init__(self, rs, e) -> None:
        self.rs = rs
        self.e = e
        self.pcf = SMBus()
        self.pcf.open(1)
        time.sleep(1)
        self.__initGPIO()
        self.init_LCD()

    # ********** property rs - (setter/getter) ***********
    @property
    def rs(self) -> int:
        """ The rs property. """
        return self.__rs

    @rs.setter
    def rs(self, value: int) -> None:
        self.__rs = value

    # ********** property e - (setter/getter) ***********

    @property
    def e(self) -> int:
        """ The e property. """
        return self.__e

    @e.setter
    def e(self, value: int) -> None:
        self.__e = value

    # ********** property pcf - (setter/getter) ***********

    @property
    def pcf(self):
        """ The pcf property. """
        return self.__pcf

    @pcf.setter
    def pcf(self, value) -> None:
        self.__pcf = value

    def __initGPIO(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.rs, GPIO.OUT)
        GPIO.setup(self.e, GPIO.OUT)

    def set_data_bits(self, value):
        self.pcf.write_byte(0x20, value)

    def __send_instruction(self, value):
        GPIO.output(self.rs, GPIO.LOW)
        self.set_data_bits(value)
        GPIO.output(self.e, GPIO.HIGH)
        time.sleep(0.01)
        GPIO.output(self.e, GPIO.LOW)
        time.sleep(0.01)

    def __send_character(self, value):
        GPIO.output(self.rs, GPIO.HIGH)
        self.set_data_bits(value)
        GPIO.output(self.e, GPIO.HIGH)
        time.sleep(0.01)
        GPIO.output(self.e, GPIO.LOW)
        time.sleep(0.01)

    @staticmethod
    def displayOn(self):
        self.__send_instruction(0b00001100)

    def init_LCD(self):
        self.__send_instruction(0b00111000)  # 1) Function set
        self.__send_instruction(0b00001100)  # 2) Display on
        self.__send_instruction(0b00000001)  # 3) Clear display en cursor home.

    def clear_LCD(self):
        self.__send_instruction(0b1)

    def second_row(self):
        self.__send_instruction(0b11000000)

    def write_message(self, tekst):
        lengte = len(tekst)  # lengte checken
        if lengte >= 16:
            tekst = tekst + '  '  # zodat de tekst niet blijft aan elkaar plakken
            for s in range(0, 5):  # hij gaat 5 keer sliden
                for i in range(len(tekst) - 15):
                    self.__send_instruction(0b00000001)
                    # selecteerd constant de i'ste letter en de 16 erachter en zet deze op het scherm
                    for char in tekst[i:i+16]:
                        self.__send_character(ord(char))
                    time.sleep(0.2)

            # gwn op tweede lijn verder gaan
            # eerste_deel = tekst[:16]
            # tweede_deel = tekst[16:]
            # for letter in eerste_deel:
            #     self.__send_character(ord(letter))
            # self.__send_instruction(0b11000000)
            # for letter in tweede_deel:
            #     self.__send_character(ord(letter))
        else:
            for letter in tekst:
                self.__send_character(ord(letter))
