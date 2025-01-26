# **Simple Portfolio APP**

## **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Steps to Run Locally](#steps-to-run-locally)
3. [Assumptions and Limitations](#assumptions-and-limitations)
4. [Links to Deployed Application](#links-to-deployed-application)

---

## **Prerequisites**

Before running the project locally, ensure you have the following installed:

1. **Node.js** version 14 or higher
2. **Java Development Kit (JDK)** version 17 or higher
3. **Maven** (if not using a prebuilt JAR file)
4. **MySQL** database installed and running
5. **Git** for version control

---

## **Steps to Run Locally**

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/Niladitya-Sen/portfolio-app.git
cd your-repository
```

### **Step 2: Configure Environment**

1. Create a new .env in `frontend` folder

    ```properties
    NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
    NEXT_PUBLIC_FINHUB_API_KEY=your-fin-hub-api-key
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    ```

2. Edit `application.properties` in `backend/src/main/resources`:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/your-database-name
   spring.datasource.username=your-username
   spring.datasource.password=your-password
   jwt.secret=your-secret-key
   ```

### **Step 3: Build the Project**

Run the following command to build the project:

1. **Frontend**:

    ```bash
    cd frontend
    npm install
    npm run build
    ```

2. **Backend**:

    ```bash
    cd backend
    mvn clean package
    ```

### **Step 4: Run the Application**

1. **Backend**:

    ```bash
    java -jar backend/target/portfolio-app-0.0.1-SNAPSHOT.jar
    ```

2. **Frontend**:

    ```bash
    cd frontend
    npm run start
    ```

### **Step 5: Access the Application**

- Open your browser and navigate to:  
  `http://localhost:3000`

---

## **Assumptions and Limitations**

### **Assumptions**

1. User can only buy 1 quantity of a stock.
2. 5 stocks are selected to build the portfolio of the user.

---

## **Links to Deployed Application**

- **Frontend**: [https://portfolio-app-gilt-phi.vercel.app](https://portfolio-app-gilt-phi.vercel.app)
- **Backend API**: [https://portfolio-app-private.onrender.com/api/](https://portfolio-app-private.onrender.com/api/)
