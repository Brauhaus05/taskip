import { Routes, Route } from 'react-router-dom';
import Shell from './components/Shell.jsx';
import Home from './screens/Home.jsx';
import Payments from './screens/Payments.jsx';
import Maintenance from './screens/Maintenance.jsx';
import Messages from './screens/Messages.jsx';
import MessageThread from './screens/MessageThread.jsx';
import RequestDetail from './screens/RequestDetail.jsx';
import Receipt from './screens/Receipt.jsx';
import PropertyInfo from './screens/PropertyInfo.jsx';
import PayFlow from './screens/PayFlow.jsx';
import PayDone from './screens/PayDone.jsx';
import NewRequest from './screens/NewRequest/index.jsx';
import RequestDone from './screens/RequestDone.jsx';

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:threadId" element={<MessageThread />} />
        <Route path="/pay" element={<PayFlow />} />
        <Route path="/pay/done" element={<PayDone />} />
        <Route path="/requests/new" element={<NewRequest />} />
        <Route path="/requests/done" element={<RequestDone />} />
        <Route path="/requests/:id" element={<RequestDetail />} />
        <Route path="/receipt/:paymentId" element={<Receipt />} />
        <Route path="/property" element={<PropertyInfo />} />
      </Routes>
    </Shell>
  );
}
