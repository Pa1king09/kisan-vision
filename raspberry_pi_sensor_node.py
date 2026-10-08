import time
import json
import random
import requests
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- CONFIGURATION ---
# Replace with your actual backend IP address if running on a separate machine
# If running locally for testing, keep as localhost
BACKEND_API_URL = "http://localhost:5000/api/predict" # Update this to your actual ML or Backend endpoint
POLLING_INTERVAL = 10 # Seconds between sensor readings

# --- MOCK SENSOR FUNCTIONS ---
# In a real Raspberry Pi, these would use libraries like RPi.GPIO or Adafruit_DHT
def read_temperature():
    """Simulates reading from a DHT11/DHT22 sensor (in Celsius)"""
    return round(random.uniform(20.0, 35.0), 2)

def read_humidity():
    """Simulates reading from a DHT11/DHT22 sensor (percentage)"""
    return round(random.uniform(40.0, 80.0), 2)

def read_npk_sensor():
    """Simulates an RS485 NPK soil sensor reading"""
    return {
        "nitrogen": random.randint(20, 120),
        "phosphorus": random.randint(15, 60),
        "potassium": random.randint(15, 60)
    }

def read_soil_ph():
    """Simulates a soil pH sensor"""
    return round(random.uniform(5.5, 7.5), 2)

def read_rainfall():
    """Simulates a rain gauge or pulls from local weather data"""
    return round(random.uniform(50.0, 200.0), 2)

# --- MAIN LOOP ---
def main():
    logging.info("Starting Raspberry Pi Sensor Node Simulation...")
    logging.info(f"Target API Endpoint: {BACKEND_API_URL}")
    
    try:
        while True:
            logging.info("Reading sensors...")
            
            # 1. Collect Data
            temp = read_temperature()
            humidity = read_humidity()
            npk = read_npk_sensor()
            ph = read_soil_ph()
            rainfall = read_rainfall()
            
            # 2. Format Payload (Matching the model's expected features)
            payload = {
                "N": npk["nitrogen"],
                "P": npk["phosphorus"],
                "K": npk["potassium"],
                "temperature": temp,
                "humidity": humidity,
                "ph": ph,
                "rainfall": rainfall
            }
            
            logging.info(f"Payload generated: {json.dumps(payload)}")
            
            # 3. Transmit Data to Server
            try:
                # We simulate a POST request to the prediction endpoint
                # In a full IoT setup, you might post to a database-saving endpoint first
                response = requests.post(
                    BACKEND_API_URL, 
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 200:
                    logging.info(f"Data transmitted successfully. Server Response: {response.json()}")
                else:
                    logging.warning(f"Failed to transmit. Status Code: {response.status_code}, Response: {response.text}")
                    
            except requests.exceptions.ConnectionError:
                logging.error(f"Connection Error: Could not reach {BACKEND_API_URL}. Is the server running?")
            except Exception as e:
                 logging.error(f"An error occurred during transmission: {e}")

            # 4. Wait before next reading
            logging.info(f"Waiting {POLLING_INTERVAL} seconds before next reading...\n")
            time.sleep(POLLING_INTERVAL)
            
    except KeyboardInterrupt:
        logging.info("Sensor Node Simulation stopped by user.")

if __name__ == "__main__":
    main()
