from RPi import GPIO
from smbus import SMBus
from time import sleep

device_address = 0x38

dht20 = SMBus()

dht20.open(1)

dht20.write_byte(device_address, 0x2C)  # Trigger a temperature and humidity measurement

sleep(0.5)  # Wait for the measurement to complete

# Read the measurement result
data = dht20.read_i2c_block_data(device_address, 0, 6)

humidity = ((((data[2] << 8 | data[3]) << 4) | ((data[4] >> 4) & 0x0F)) / 2**20) *100
temperature = (((data[4] & 0x7F) << 8 | data[5]) / 2**20) *200 -50

if data[4] & 0x80:
    temperature = -temperature

print(f"Temperature: {temperature}°C")
print(f"Humidity: {humidity}%")

GPIO.cleanup()





