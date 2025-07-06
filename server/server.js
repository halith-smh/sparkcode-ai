import app from "./src/app.js";
import { PORT } from "./src/config/env.js";

(() => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
})();