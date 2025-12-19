import Animal from "../models/Animal.js";

// ➕ Add new animal
export const addAnimal = async (req, res) => {
  try {
    const { name, breed } = req.body;
    if (!name || !breed) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newAnimal = new Animal({ name, breed });
    await newAnimal.save();
    res.status(201).json(newAnimal);
  } catch (error) {
    console.error("Add Animal Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ➕ Add health log
export const addHealthLog = async (req, res) => {
  try {
    const { animalId } = req.params;
    let {
      temperature,
      heartRate,
      activity,
      appetite,
      oxygen,
      notes,
      day,
      month,
      year,
      risk,
    } = req.body;

    // ✅ Check required values
    if (!temperature || !heartRate || !month || !year || !day) {
      return res.status(400).json({
        message: "Temperature, heart rate, day, month, and year are required.",
      });
    }

    const animal = await Animal.findById(animalId);
    if (!animal) return res.status(404).json({ message: "Animal not found" });

    // ✅ Convert & validate
    temperature = parseFloat(temperature);
    heartRate = parseFloat(heartRate);
    oxygen = oxygen ? parseFloat(oxygen) : null;
    day = parseInt(day);
    year = parseInt(year);
    activity = parseFloat(activity) || 0;
    appetite = parseFloat(appetite) || 0;
    risk = parseFloat(risk) || 0;

    // ✅ Validate oxygen only if provided
    if (oxygen !== null && (oxygen < 70 || oxygen > 100)) {
      return res.status(400).json({
        message: "Oxygen must be between 70 and 100 if provided.",
      });
    }

    // Prevent duplicates
    const exists = animal.healthLogs.some(
      (log) => log.day === day && log.month === month && log.year === year
    );
    if (exists) {
      return res.status(400).json({
        message: `Health log for ${day}-${month}-${year} already exists.`,
      });
    }

    const newLog = {
      date: new Date().toLocaleString(),
      day,
      month,
      year,
      temperature,
      heartRate,
      activity,
      appetite,
      oxygen: oxygen ?? null,
      notes: notes || "",
      risk,
    };

    animal.healthLogs.push(newLog);
    await animal.save();

    res.status(201).json({ message: "Health log saved successfully", log: newLog });
  } catch (error) {
    console.error("Error adding health log:", error);
    res.status(500).json({
      message: "Server error while saving health log",
      error: error.message,
    });
  }
};

// 🌱 Get all animals
export const getAnimalsByUser = async (req, res) => {
  try {
    const animals = await Animal.find();
    res.status(200).json(animals);
  } catch (error) {
    console.error("Get Animals Error:", error);
    res.status(500).json({ message: "Error fetching animals" });
  }
};

// 📊 Get health logs
export const getHealthLogs = async (req, res) => {
  try {
    const { animalId } = req.params;
    const { year } = req.query;

    const animal = await Animal.findById(animalId);
    if (!animal) return res.status(404).json({ message: "Animal not found" });

    let logs = animal.healthLogs;
    if (year) logs = logs.filter((log) => log.year === parseInt(year));

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ message: "Error fetching logs" });
  }
};
