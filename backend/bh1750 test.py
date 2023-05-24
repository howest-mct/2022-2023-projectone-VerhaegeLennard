from backend.helpers.BH1750 import BH1750
from time import sleep

bh1750 = BH1750(0x23)

def setup():
  bh1750.powerOn()

try:
  setup()
  while True:
    print(bh1750.lux)
    sleep(0.15)

except KeyboardInterrupt as e:
  print(e)

finally:
  print("klaar")
