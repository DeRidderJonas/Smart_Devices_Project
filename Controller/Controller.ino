#define tilt 2
bool tilted = false;

unsigned long previousMillis = 0;
const long interval = 1000;

void setup() {
  // put your setup code here, to run once:
  pinMode(tilt, INPUT);
  attachInterrupt(digitalPinToInterrupt(tilt), toggleMoving, CHANGE);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:

}

void toggleMoving(){
  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis >= interval){
    previousMillis = currentMillis;
    tilted = !tilted;
    Serial.write("tilted");
  }
}

