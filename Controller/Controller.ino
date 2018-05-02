#define tilt 2
#define potPin A0
bool tilted = false;
int potVal = 0;

unsigned long previousMillis = 0;
const long interval = 1000;

void setup() {
  // put your setup code here, to run once:
  pinMode(tilt, INPUT);
  pinMode(potPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(tilt), toggleMoving, CHANGE);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  potVal = analogRead(potPin);
  Serial.print(potVal);
  Serial.write("\n");
}

void toggleMoving(){
  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis >= interval){
    previousMillis = currentMillis;
    tilted = !tilted;
    Serial.write("tilted");
  }
}

