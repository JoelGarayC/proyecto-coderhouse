import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const pathBase = join(__dirname, "/../..");

export default pathBase;
