#include <SoftwareSerial.h>
#include <LiquidCrystal.h>
SoftwareSerial mySerial(3,4);
#define rs 9
#define enable 10
#define d4 5
#define d5 6
#define d6 7
#define d7 8
LiquidCrystal lcd(rs,enable,d4,d5,d6,d7);
#define buzzer 12
#define winLED 1
#define lossLED 2
void setup() {
  // put your setup code here, to run once:
  lcd.begin(16,2);
  Serial.begin(9600);
  pinMode(buzzer, OUTPUT);
  pinMode(winLED, OUTPUT);
  pinMode(lossLED, OUTPUT);
  while(!Serial){
    
  }

  Serial.println("Serial connected");
  mySerial.begin(9600);
  mySerial.println("mySerial connected");
}

void loop() {
  // put your main code here, to run repeatedly:
  if(mySerial.available()){
    int inByte = mySerial.read();
    Serial.write(inByte);
    lcd.clear();
    switch(inByte){
      case 'w':
        playVictorySound();
        digitalWrite(winLED, HIGH);
        lcd.write("winner winner");
        lcd.setCursor(0,1);
        lcd.write("Chicken dinner!");
        break;
      case 'l':
        playLosingSound();
        digitalWrite(lossLED, HIGH);
        lcd.write("You lose!");
        break;
      case 'r':
        lcd.write("reseting");
        digitalWrite(winLED, LOW);
        digitalWrite(lossLED, LOW);
        break;  
      default:
        lcd.write(inByte);
        break;  
    }
  }
  if(Serial.available()){
    mySerial.write(Serial.read());
  }
}

void playVictorySound(){
  //you know what to do...
}

void playLosingSound(){
  //you know...
}

