#include <SoftwareSerial.h>
#include <LiquidCrystal.h>
SoftwareSerial mySerial(3,4);
#define rs 9
#define enable 10
#define d4 8
#define d5 7
#define d6 6
#define d7 5
LiquidCrystal lcd(rs,enable,d4,d5,d6,d7);
#define sAudioPin 12
#define winLED 1
#define lossLED 2
void setup() {
  // put your setup code here, to run once:
  lcd.begin(16,2);
  Serial.begin(9600);
  pinMode(sAudioPin, OUTPUT);
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
    switch(inByte){
      case '1':
        lcd.clear();
        playSound(true);
        digitalWrite(winLED, HIGH);
        lcd.write("winner winner");
        lcd.setCursor(0,1);
        lcd.write("Chicken dinner!");
        break;
      case '2':
        lcd.clear();
        playSound(false);
        digitalWrite(lossLED, HIGH);
        lcd.write("You lose!");
        break;
      case '3':
        lcd.clear();
        lcd.write("reseting");
        digitalWrite(winLED, LOW);
        digitalWrite(lossLED, LOW);
        break;
      case '0':
        lcd.clear();
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

#define F5 698.46
#define C5 523.25
#define T  739.99
#define DB4 277.18
#define BB4 466.16

#define BPM 120    //  you can change this value changing all the others
#define H 2*Q //half 2/4
#define Q 60000/BPM //quarter 1/4 
#define E Q/2   //eighth 1/8
#define D Q/3
#define S Q/4 // sixteenth 1/16
#define W 4*Q // whole 4/4
void playSound(bool victory){
  
if(victory)
      {
        tone(sAudioPin, F5, D);
        delay(D+1);
        tone(sAudioPin, C5, S);
        delay(S+1);
        tone(sAudioPin, F5, D);
        delay(D+1);
        tone(sAudioPin, T, Q);
        delay(Q+1);
        tone(sAudioPin, C5, Q);
        delay(Q+1);
        delay(S);
        tone(sAudioPin, C5, Q);
        delay(Q+1);
        tone(sAudioPin, F5, E);
        delay(E+1);
        delay(S);
        tone(sAudioPin, C5, E);
        delay(E+1);
        tone(sAudioPin, F5, H);
        delay(H+1);
        
      }
      else
      {
        tone(sAudioPin, F5, Q);
      }
}

