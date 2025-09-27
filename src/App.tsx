import { FC } from "react"
import MainPage from "./pages/MainPage"

interface AppProps {
  placesCount: number
}

const App: FC<AppProps> = ({ placesCount }) => (
  <MainPage placesCount={placesCount} />
)

export default App
