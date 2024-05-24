import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "./context/UserProvider";
import Navigation from "./components/Navigation";
import Toast from "react-native-toast-message";
import { TransactionProvider } from "./context/TransactionContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <TransactionProvider>
          <Navigation />
        </TransactionProvider>
      </UserProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
