from smbus import SMBus


class BH1750:
    def __init__(self, address=0x23) -> None:
        self.address = address
        self.bh1750 = SMBus()
        self.bh1750.open(1)

    # ********** property lux - (enkel getter) ***********
    @property
    def lux(self) -> float:
        """ The lux property. """
        return self.meetLux()

    def meetLux(self):
        data = self.bh1750.read_i2c_block_data(self.address, 0x11)
        return self.convertToLux(data)

    def convertToLux(self, data):
        result = ((data[0] << 8) | data[1]) / 1.2
        return (result)

    def powerOff(self):
        self.bh1750.write_byte(self.address, 0x00)

    def powerOn(self):
        self.bh1750.write_byte(self.address, 0x01)

    def resetRegister(self):
        self.bh1750.write_byte(self.address, 0x07)
