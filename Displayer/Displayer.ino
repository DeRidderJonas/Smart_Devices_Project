#include <SoftwareSerial.h>
#include <LiquidCrystal.h>
SoftwareSerial mySerial(3,4);
#define rs 9
#define enable 10
#define d4 5
#define d5 6
#define d6 7
#define d7 8
LiquidCrystal lcd(rs,enable,d4,d5,d6d,7);
void setup() {
  // put your setup code here, to run once:
  lcd.begin(16,2);
  Serial.begin(9600);
  while(!Serial){
    
  }

  Serial.println("Serial connected");
  mySerial.begin(9600);
  mySerial.println("mySerial connected");
}

void loop() {
  // put your main code here, to run repeatedly:
  if(mySerial.available()){
    Serial.write(mySerial.read());
  }
  if(Serial.available()){
    mySerial.write(Serial.read());
  }
}
