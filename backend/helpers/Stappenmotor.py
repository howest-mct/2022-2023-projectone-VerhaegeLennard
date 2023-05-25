import RPi.GPIO as GPIO
import time

class Stappenmotor:
    def __init__(self, in1, in2, in3, in4):
        self.IN1 = in1
        self.IN2 = in2
        self.IN3 = in3
        self.IN4 = in4

        self.stappen = [[1, 0, 0, 1],
                        [1, 0, 0, 0],
                        [1, 1, 0, 0],
                        [0, 1, 0, 0],
                        [0, 1, 1, 0],
                        [0, 0, 1, 0],
                        [0, 0, 1, 1],
                        [0, 0, 0, 1]]

        self.setup()

    def setup(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.IN1, GPIO.OUT)
        GPIO.setup(self.IN2, GPIO.OUT)
        GPIO.setup(self.IN3, GPIO.OUT)
        GPIO.setup(self.IN4, GPIO.OUT)

    def draai(self, aantal_stappen, delay):
        for s in range(abs(aantal_stappen)):
            if aantal_stappen > 0:
                for i in range(8):
                    self.doe_stap(self.stappen[i])
                    time.sleep(delay)
            else:
                for i in range(7, -1, -1):
                    self.doe_stap(self.stappen[i])
                    time.sleep(delay)

    def doe_stap(self, stap):
        GPIO.output(self.IN1, stap[0])
        GPIO.output(self.IN2, stap[1])
        GPIO.output(self.IN3, stap[2])
        GPIO.output(self.IN4, stap[3])