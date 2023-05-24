from RPi import GPIO
from time import sleep
from helpers.SGP30 import SGP30

sgp30 = SGP30(0x58)

def setup():
    pass

try:
    setup()
    while True:
        print("TVOC (in ppb):", sgp30.TVOC)
        print("eCO2 (in ppm):", sgp30.eCO2)

except KeyboardInterrupt as e:
    print(e)

finally:
    print("klaar")


