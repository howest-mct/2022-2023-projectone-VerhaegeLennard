from RPi import GPIO
from smbus import SMBus
from time import sleep
from SGP30 import SGP30

sgp30 = SGP30(0x58)

def setup():
    pass

try:
    setup()
    while True:
        print(sgp30.iaq_measure())

except KeyboardInterrupt as e:
    print(e)

finally:
    print("klaar")


