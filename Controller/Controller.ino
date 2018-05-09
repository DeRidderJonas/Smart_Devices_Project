#define startStop 2
#define tilt 3
#define potPin A0
bool left = true;
bool tilted = false;
bool playing = false;
int potVal = 0;

unsigned long previousMillisTilt = 0;
unsigned long previousMillisDir = 0;
unsigned long previousMillisStartStop = 0;
const long interval = 1000;

void setup() {
  // put your setup code here, to run once:
  pinMode(tilt, INPUT);
  pinMode(startStop, INPUT);
  pinMode(potPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(tilt), toggleMoving, RISING);
  attachInterrupt(digitalPinToInterrupt(startStop), toggleOn, RISING);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  potVal = analogRead(potPin);
  if(potVal<=512){
    Serial.print("left");
  } else {
    Serial.print("right");
  }
  
}

void buttonPressed(int button){
  unsigned long currentMillis = millis();
  unsigned long previousMillis;
  switch(button){
    case 0:
      previousMillis = previousMillisTilt;
      if(currentMillis - previousMillisTilt >= interval){
        previousMillisTilt = currentMillis;
        tilted = !tilted;
        Serial.print("tilted: ");
        Serial.print(tilted);
      }
      break;
      case 1:
      previousMillis = previousMillisStartStop;
      if(currentMillis - previousMillisStartStop >= interval){
        previousMillisStartStop = currentMillis;
        playing = !playing;
        Serial.print("playing: ");
        Serial.print(playing);
      }
      break;
  }
  
}

void toggleMoving(){
  buttonPressed(0);
}


void toggleOn(){
  buttonPressed(1);
}

