import mongoose from 'mongoose'; // Utilisation des schémas dans Mongoose

const generateAuthToken = async function() {
    var token = sign({ data: 'bar', role: 'admin'}, 'cledechiffrage');
    return token
}

const Inscription = async (req, res) => {
    const { users, email, password } = req.body;

    if (!users || !email || !password) {
        return res.status(400).send('Username, email, and password are required');
    }

    try {
        const existingUser = await users.findOne({ $or: [{ users }, { email }] });

        if (existingUser) {
            return res.status(400).send('User with this username or email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({ users, email, password: hashedPassword });
        await newUser.save();

        const token = sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '1h' });

        
        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', `Bearer ${token}`);

        res.status(201).send({
            message: 'Registration successful',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Invalid username or password');
        }

        const token = await userModel.generateAuthToken();

        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', `Bearer ${token}`);

        res.status(200).send({
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).send('Internal Server Error');
    }
}

export default {
    generateAuthToken,
    Inscription,
    login

};  