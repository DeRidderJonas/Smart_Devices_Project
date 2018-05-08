#define tilt 2
#define changeDir 3
#define startStop 4
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
  pinMode(changeDir, INPUT);
  pinMode(startStop, INPUT);
  pinMode(potPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(tilt), toggleMoving, CHANGE);
  attachInterrupt(digitalPinToInterrupt(changeDir), toggleDir, CHANGE);
  attachInterrupt(digitalPinToInterrupt(startStop), toggleOn, CHANGE);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  potVal = analogRead(potPin);
  Serial.print(potVal);
  Serial.write("\n");
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
        Serial.write("tilted " + tilted);
      }
      break;
    case 1:
      previousMillis = previousMillisDir;
      if(currentMillis - previousMillisDir >= interval){
        previousMillisDir = currentMillis;
        left = !left;
        Serial.write("toggleDir " + left);
      }
      break;
    case 2:
      previousMillis = previousMillisStartStop;
      if(currentMillis - previousMillisStartStop >= interval){
        previousMillisStartStop = currentMillis;
        playing = !playing;
        Serial.write("togglePlaying " + playing);
      }
      break;
  }
  if(currentMillis - previousMillis >= interval){
    
  }
}

void toggleMoving(){
  buttonPressed(0);
}

void toggleDir(){
  buttonPressed(1);
}

void toggleOn(){
  buttonPressed(2);
}

