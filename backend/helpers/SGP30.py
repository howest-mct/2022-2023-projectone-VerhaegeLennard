from smbus import SMBus
from time import sleep
from typing import List

class SGP30:
    def __init__(self,address=0x58) -> None:
        self.i2c = SMBus()
        self.i2c.open(1)

        self._address = address

        self.iaq_init()

    @property
    def TVOC(self) -> int:
        """TVOC in ppb"""
        return self.iaq_measure()[1]

    @property
    def eCO2(self) -> int:
        """CO2 equivalent in ppm"""
        return self.iaq_measure()[0]
    
    def iaq_init(self) -> List[int]:
        """Init van de sensor"""
        self.i2c.write_i2c_block_data(self._address, 0x20, [0x03, 0x00])
        #Geef de sensor 15 seconden om op te starten
        # sleep(15)

    def iaq_measure(self) -> List[int]:
        """meet eCO2 & TVOC"""
        self.i2c.write_i2c_block_data(self._address, 0x20, [0x08, 0x00])
        #wachten tot meting gebeurt is
        sleep(0.5)
        data = self.i2c.read_i2c_block_data(self._address, 0x2A, 6)
        eCO2 = (data[0] << 8) | data[1]
        TVOC = (data[3] << 8) | data[4]
        return [eCO2, TVOC]
