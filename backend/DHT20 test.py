from helpers.DHT20 import DHT20
from time import sleep

dht20 = DHT20(0x38)

def setup():
    pass

try:
    setup()
    while True:
        print("Vochtigheid:", round(dht20.Humidity,2), "%")
        print("Temperatuur:", round(dht20.Temperatuur,2), "°C")
        sleep(0.5)

except KeyboardInterrupt as e:
    print(e)

finally:
    print("klaar")
