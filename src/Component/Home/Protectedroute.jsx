import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../Localstorage";
import { useAccessCard } from "../Globalvariable/Accessprovider";

const ProtectedRoute = ({ children }) => {
    const { setNotification } = useAccessCard();
    if (!isLoggedIn()) {
        setNotification({message: "Login first",type:"warning"})
        setTimeout(() => setNotification(null), 3000);
        return <Navigate to="/" replace />; 
    }
    return children;
};

export default ProtectedRoute;
