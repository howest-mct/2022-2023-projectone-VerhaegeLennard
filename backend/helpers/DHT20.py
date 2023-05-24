from RPi import GPIO
from smbus import SMBus
from time import sleep

class DHT20:
    def __init__(self, dht20_address=0x38) -> None:
        self.address = dht20_address
        self.dht20 = SMBus()
        self.dht20.open(1)

        self._setup_()

    # ********** property Temperatuur - (enkel getter) ***********
    @property
    def Temperatuur(self) -> float:
        """ The Temperatuur property. """
        return self.meet_waardes()[0]

    # ********** property Humidity - (enkel getter) ***********
    @property
    def Humidity(self) -> float:
        """ The Humidity property. """
        return self.meet_waardes()[1]

    def _setup_(self):
        data = self.dht20.read_i2c_block_data(self.address, 0x71, 1)
        # controle als goed opgestart
        if (data[0] | 0x08) == 0:
            print('Opstartfout :/')

    def meet_waardes(self):
        # trigger de meetingen
        self.dht20.write_i2c_block_data(self.address, 0xac, [0x33, 0x00])
        sleep(0.1)

        # lees de data van de sensor
        data = self.dht20.read_i2c_block_data(self.address, 0x71, 7)

        Tdata = ((data[3] & 0xf) << 16) + (data[4] << 8) + data[5]
        temperatuur = 200*float(Tdata)/2**20 - 50

        Hdata = ((data[3] & 0xf0) >> 4) + (data[1] << 12) + (data[2] << 4)
        humidity = 100*float(Hdata)/2**20

        return [temperatuur, humidity]
