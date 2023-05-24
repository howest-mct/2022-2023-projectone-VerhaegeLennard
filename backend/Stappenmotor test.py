import RPi.GPIO as GPIO
import time

# Define GPIO pins for the motor
IN1 = 12
IN2 = 16
IN3 = 20
IN4 = 21

# Define the sequence of steps for the motor
SEQ = [[1, 0, 0, 1],
       [1, 0, 0, 0],
       [1, 1, 0, 0],
       [0, 1, 0, 0],
       [0, 1, 1, 0],
       [0, 0, 1, 0],
       [0, 0, 1, 1],
       [0, 0, 0, 1]]

# Initialize GPIO pins
def setup():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(IN1, GPIO.OUT)
    GPIO.setup(IN2, GPIO.OUT)
    GPIO.setup(IN3, GPIO.OUT)
    GPIO.setup(IN4, GPIO.OUT)

# Rotate the motor by the specified number of steps and delay between steps
def rotate(steps, delay):
    for _ in range(steps):
        for i in range(8):
            GPIO.output(IN1, SEQ[i][0])
            GPIO.output(IN2, SEQ[i][1])
            GPIO.output(IN3, SEQ[i][2])
            GPIO.output(IN4, SEQ[i][3])
            time.sleep(delay)

# Cleanup GPIO pins
def cleanup():
    GPIO.cleanup()

# Main program
if __name__ == '__main__':
    try:
        setup()
        rotate(512, 0.001)  # Rotate 512 steps with a delay of 1ms between steps
        cleanup()
    except KeyboardInterrupt:
        cleanup()
