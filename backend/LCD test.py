import time
from RPi import GPIO
from LCD_metPCF import LCD

lcd = LCD(17,22)

lcd.init_LCD()

lcd.write_message("HALLO")

time.sleep(10)

GPIO.cleanup()