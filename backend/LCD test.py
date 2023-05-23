import time
from RPi import GPIO
from lcd import LCD

lcd = LCD(17,22,27)

lcd.init_LCD()

lcd.write_message("Hallowkes")

time.sleep(5)

GPIO.cleanup()