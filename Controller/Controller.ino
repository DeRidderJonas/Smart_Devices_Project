#define startStop 2
#define tilt 3
#define potPin A0
#define ledLeft 12
#define ledUp 13
#define ledRight 10
#define ledDown 11
bool tilted = false;
bool playing = false;
int potVal = 0;
int dir = 0; //0 achteruit; 1 links; 2 vooruit; 3 rechts

unsigned long previousMillisTilt = 0;
unsigned long previousMillisDir = 0;
unsigned long previousMillisStartStop = 0;
const long interval = 1000;

void setup() {
  // put your setup code here, to run once:
  pinMode(tilt, INPUT);
  pinMode(startStop, INPUT);
  pinMode(potPin, INPUT);
  pinMode(ledLeft,OUTPUT);
  pinMode(ledUp,OUTPUT);
  pinMode(ledRight,OUTPUT);
  pinMode(ledDown,OUTPUT);
  attachInterrupt(digitalPinToInterrupt(tilt), toggleMoving, RISING);
  attachInterrupt(digitalPinToInterrupt(startStop), toggleOn, RISING);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  potVal = analogRead(potPin);

  
  if(potVal<=128){   
    dir = 0;
    digitalWrite(ledUp, LOW);
    digitalWrite(ledLeft, LOW);
    digitalWrite(ledRight, LOW);
    digitalWrite(ledDown,HIGH);
  } else if(potVal<=384) {
    dir = 1;
    digitalWrite(ledUp, LOW);
    digitalWrite(ledLeft, HIGH);
    digitalWrite(ledRight, LOW);
    digitalWrite(ledDown,LOW);
  }else if(potVal<=640) {
    dir = 2;
    digitalWrite(ledUp, HIGH);
    digitalWrite(ledLeft, LOW);
    digitalWrite(ledRight, LOW);
    digitalWrite(ledDown,LOW);
  }else if(potVal<=896) {
    dir = 3;
    digitalWrite(ledUp, LOW);
    digitalWrite(ledLeft, LOW);
    digitalWrite(ledRight, HIGH);
    digitalWrite(ledDown,LOW);
  }else {
    dir = 0;
    digitalWrite(ledUp, LOW);
    digitalWrite(ledLeft, LOW);
    digitalWrite(ledRight, LOW);
    digitalWrite(ledDown,HIGH);
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
        Serial.print(dir);
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

