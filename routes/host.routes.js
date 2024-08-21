const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const Host = require("../models/Host.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { email, password, name, lastname } = req.body;

  // Check if email or password or name are provided as empty strings
  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  Host.findOne({ email })
    .then((foundHost) => {
      // If the user with the same email already exists, send an error response
      if (foundHost) {
        res.status(400).json({ message: "Host already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return Host.create({ email, password: hashedPassword, name, lastname });
    })
    .then((createdHost) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id } = createdHost;

      // Create a new object that doesn't expose the password
      const host = { email, name, _id };

      // Send a json response containing the user object
      res.status(201).json({ host: host });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  Host.findOne({ email })
    .then((foundHost) => {
      if (!foundHost) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "Host not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundHost.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name, profileImage: imageUrl, lastname } = foundHost;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name, imageUrl };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        console.log(imageUrl);
        res.status(200).json({ _id, authToken, email, name, lastname, imageUrl });
      } else {
        res.status(401).json({ message: "Unable to authenticate the host" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

//Ruta para subir una imagen de perfil
router.post("/upload", isAuthenticated, async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    console.log(imageUrl);
    const userId = req.payload._id;  // Asume que el usuario autenticado está en el payload
    // Buscar al usuario por ID
    const host = await Host.findById(userId);

    if (!host) {
      return res.status(404).json({ message: "Host not found." });
    }

    // Actualizar el campo profileImage con la nueva URL
    host.profileImage = imageUrl;
    await host.save();

    res.json({ message: "Profile image updated successfully" });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Ruta para borrar el usuario
router.delete('/delete', isAuthenticated, async (req, res) => {
  try {
    const userId = req.payload._id; // El ID del usuario autenticado se obtiene de `req.payload`

    // Buscar y eliminar el usuario en la base de datos
    const deletedUser = await Host.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//ruta para editar el perfil del usuario
router.put("/update", isAuthenticated, async (req, res, next) => {
  console.log('we are on update')
  try {
    const { id, name, lastname, email } = req.body;
    console.log(id)

    const user = await Host.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Obtener un Host por ID
router.get('/:id', async (req, res) => {
  try {
    const host = await Host.findById(req.params.id).populate('reviews'); 
    if (!host) {
      return res.status(404).json({ error: 'Host not found' });
    }
    res.json(host);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching host data' });
  }
});

// Agregar una nueva review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { rating, reviews } = req.body;
    const host = await Host.findById(req.params.id);
    if (!host) {
      return res.status(404).json({ error: 'Host not found' });
    }
    host.reviews.push({ rating, reviews });
    await host.save();
    res.json(host.reviews[host.reviews.length - 1]);
  } catch (error) {
    res.status(500).json({ error: 'Error adding review' });
  }
});


module.exports = router;
