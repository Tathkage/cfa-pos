import { BrowserRouter as Router, Routes, Route }
    from 'react-router-dom';
import LandingPage from "./landingPage";
import MenuOrdering from "./customer_pages/menuOrdering";
import EmployeeLogin from "./employeeLogin";
import ManagerLanding from "./employee_pages/managerLanding";
import ServerOrder from "./employee_pages/serverOrder";

import Settings from "./settings"

/**
 * This function is used to handle page redirections
 * @returns {JSX.Element}
 * @constructor
 */
function PageRedirection() {
    return (
        <div>
            <Router>
            <Routes>
                <Route exact path="/" element={<LandingPage />}/>
                <Route exact path="/landing" element={<LandingPage />}/>
                <Route exact path="/order" element={<MenuOrdering />}/>
                <Route exact path="/login" element={<EmployeeLogin />}/>
                <Route exact path="/login/server" element={<ServerOrder />}/>
                <Route exact path="/login/managerlanding" element={<ManagerLanding />}/>
                <Route exact path="/settings" element={<Settings />}/>
            </Routes>
            </Router>
        </div>
    );
}

export default PageRedirection