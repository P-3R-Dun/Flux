import { useDashboardData } from "@/hooks/useDashboardData";
import { motion, AnimatePresence } from "motion/react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router";
import { FingerprintPattern, KeyRound, Wallet, MessagesSquare, LogOut, 
    UserX, ChevronRight, Pencil, ChevronLeft, CircleCheck, CircleX, Check, 
    Trash2, Edit3, AlertTriangle} from "lucide-react"
import { Avatar } from "@/components/ui/shared/Avatar";
import { useSetPassword } from "@/hooks/useAuth";
import { useSetAvatar, useSetName } from "@/hooks/useProfile"
import { useAuthStore } from "@/store/useAuthStore"
import { useWallets } from "@/hooks/useWallets"
import { useFeedback } from "@/hooks/useFeedback";

const ProfileModal = ({ profile, onClose, showToast, onProfileUpdate }: { profile: any, onClose: () => void, showToast: (message: string, type: 'success' | 'error') => void, onProfileUpdate: (token: string) => void }) => {
    const [firstName, setFirstName] = useState(profile?.first_name || '');
    const [lastName, setLastName] = useState(profile?.last_name || '');
    const { isLoading, isSuccess, setName } = useSetName();
    const token = localStorage.getItem('access') || sessionStorage.getItem('access') || '';

    useEffect(() => {
        if (isSuccess) {
            showToast("Name successfully updated!", "success");
            onProfileUpdate(token)
            onClose();
        }
    }, [isSuccess]);

    const handleSaveChanges = async () => {
        try {
            await setName(token, firstName, lastName);
        } catch (err: any) {
            const errorMsg = err?.first_name?.[0] || 
                             err?.last_name?.[0] ||
                             "Failed to set name";
            showToast(errorMsg, "error");
        }
    }
    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold text-white text-center">Edit Profile</h2>
            <h3 className="text-sm text-gray-300 mb-4">Update your personal information</h3>
            <input 
                type="text" 
                placeholder="First Name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                className="w-full bg-[#252836] text-white p-4 rounded-xl mb-4 outline-none focus:ring-1 focus:ring-gray-500 transition-all" 
            />
            <input 
                type="text" 
                placeholder="Last Name (optional)" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                className="w-full bg-[#252836] text-white p-4 rounded-xl mb-4 outline-none focus:ring-1 focus:ring-gray-500 transition-all" 
            />
            <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full bg-button-gradient text-white p-4 rounded-xl mt-2"
                onClick={handleSaveChanges}
            >
                Save Changes
            </motion.button>
        </div>
    )
}

const AuthModal = ({ profile, onClose, showToast }: { profile: any, onClose: () => void, showToast: (message: string, type: 'success' | 'error') => void }) => {
    return (
        <div>
            <p>Damn</p>
        </div>
    )
}

const PasswordModal = ({ profile, onClose, showToast }: { profile: any, onClose: () => void, showToast: (message: string, type: 'success' | 'error') => void }) => {
    const {isLoading, isSuccess, setPassword } = useSetPassword()
    const [ currentPassword, setCurrentPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const token = localStorage.getItem('access') || sessionStorage.getItem('access') || '';
    const { fetchProfile } = useDashboardData()

    useEffect(() => {
        if (isSuccess) {
            fetchProfile(token)
            onClose();
        } 
    }, [isSuccess]);

    const handleSubmit = async () => {
        if (!token) 
            return;
        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match!", "error");
            return;
        }
        try {
            await setPassword(token, currentPassword, newPassword);
            showToast("Password successfully changed!", "success");
            onClose();
        } catch (err: any) {
            const errorMsg = err?.current_password?.[0] || 
                         err?.new_password?.[0] || 
                         err?.non_field_errors?.[0] || 
                         "Failed to change password";
            showToast(errorMsg, "error");
        }
    };
    return (
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold text-white text-center">Change Password</h2>
            <h3 className="text-sm text-gray-300 mb-4">Change the password for your account</h3>
            <input 
                type="password" 
                placeholder="Current Password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                className="w-full bg-[#252836] text-white p-4 rounded-xl mb-4 outline-none focus:ring-1 focus:ring-gray-500 transition-all" 
            />
            <input 
                type="password" 
                placeholder="New Password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full bg-[#252836] text-white p-4 rounded-xl mb-4 outline-none focus:ring-1 focus:ring-gray-500 transition-all" 
            />
            <input 
                type="password" 
                placeholder="Confirm New Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="w-full bg-[#252836] text-white p-4 rounded-xl mb-4 outline-none focus:ring-1 focus:ring-gray-500 transition-all" 
            />
            <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full bg-button-gradient text-white p-4 rounded-xl mt-2"
                onClick={handleSubmit}
            >
                Change Password
            </motion.button>
        </div>
    )
}

const WalletsModal = ({ profile, onClose, showToast }: any) => {
    const [view, setView] = useState<'list' | 'actions' | 'edit' | 'confirm'>('list');
    const [selectedWallet, setSelectedWallet] = useState<any>(null);
    
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('UAH');

    const { updateWallet, createWallet, deleteWallet, isLoading } = useWallets();
    const { fetchProfile } = useDashboardData();
    const token = localStorage.getItem('access') || sessionStorage.getItem('access') || '';

    const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleLongPressStart = (wallet: any) => {
        pressTimer.current = setTimeout(() => {
            setSelectedWallet(wallet);
            setView('actions');
        }, 600);
    };

    const handleLongPressEnd = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    const onConfirmDelete = async () => {
        if (selectedWallet.is_active) return;
        try {
            await deleteWallet(selectedWallet.id, token);
            showToast("Wallet deleted", "success");
            fetchProfile(token);
            setView('list');
        } catch (e) { showToast("Error", "error"); }
    };

    const onSaveEdit = async () => {
        try {
            if (selectedWallet) {
                await updateWallet(selectedWallet.id, { name, currency }, token);
                showToast("Wallet updated!", "success");
            } else {
                await createWallet({ 
                    name, 
                    currency, 
                    icon_name: 'Wallet', 
                    is_active: false
                }, token);
                showToast("New wallet created!", "success");
            }
            fetchProfile(token);
            setView('list');
            setName('');
            setCurrency('UAH');
        } catch (e) { 
            showToast("Failed to save wallet", "error"); 
        }
    };

    return (
        <div className="flex flex-col w-full min-h-75 text-white select-none">
            <AnimatePresence mode="wait">
                {view === 'list' && (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h2 className="text-xl font-bold text-center mb-4">Select Wallet</h2>
                        <div className="flex flex-col gap-2">
                            {profile?.wallets?.map((w: any) => (
                                <div
                                    key={w.id}
                                    onPointerDown={() => handleLongPressStart(w)}
                                    onPointerUp={handleLongPressEnd}
                                    onClick={() => !w.is_active && updateWallet(w.id, {is_active: true}, token).then(() => {fetchProfile(token); showToast("Wallet was successfully switched!", "success"); onClose();})}
                                    className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                                        w.is_active ? 'bg-[#3A4368] border-[#6B79B5]' : 'bg-[#252836] border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Wallet className={w.is_active ? "text-white" : "text-gray-500"} />
                                        <span>{w.name} <span className="text-xs text-gray-500">({w.currency})</span></span>
                                    </div>
                                    {w.is_active && <Check className="text-green-400 w-5 h-5" />}
                                </div>
                            ))}
                            <button onClick={() => { setSelectedWallet(null); setView('edit'); }} className="mt-2 p-4 border-2 border-dashed border-gray-700 rounded-2xl text-gray-500">+ Add New</button>
                        </div>
                    </motion.div>
                )}
                {view === 'actions' && (
                    <motion.div key="actions" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col gap-3">
                        <h2 className="text-lg font-bold text-center">{selectedWallet?.name}</h2>
                        <button onClick={() => { setName(selectedWallet.name); setCurrency(selectedWallet.currency); setView('edit'); }} className="flex items-center gap-3 p-4 bg-[#252836] rounded-2xl">
                            <Edit3 className="text-blue-400" /> Edit Details
                        </button>
                        <button 
                            disabled={selectedWallet?.is_active}
                            onClick={() => setView('confirm')}
                            className={`flex items-center gap-3 p-4 rounded-2xl ${selectedWallet?.is_active ? 'bg-gray-800 opacity-50' : 'bg-[#252836]'}`}
                        >
                            <Trash2 className="text-[#FF5C5C]" /> 
                            <p className="text-[#FF5C5C]">{selectedWallet?.is_active ? "Cannot delete active wallet" : "Delete Wallet"}</p>
                        </button>
                        <button onClick={() => setView('list')} className="p-4 bg-gray-700 rounded-2xl mt-2">Back</button>
                    </motion.div>
                )}
                {view === 'confirm' && (
                    <motion.div key="confirm" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                        <AlertTriangle className="w-12 h-12 text-[#FF5C5C] mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Are you sure?</h2>
                        <p className="text-gray-400 mb-6">All transactions linked to "{selectedWallet?.name}" will also be affected.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setView('actions')} className="flex-1 p-4 bg-gray-700 rounded-2xl">Cancel</button>
                            <button onClick={onConfirmDelete} className="flex-1 p-4 bg-[#FF5C5C] rounded-2xl font-bold">Yes, Delete</button>
                        </div>
                    </motion.div>
                )}
                {view === 'edit' && (
                    <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 className="text-xl font-bold mb-4">{selectedWallet ? 'Edit Wallet' : 'New Wallet'}</h2>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#252836] p-4 rounded-xl mb-3 outline-none" placeholder="Name" />
                        <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full bg-[#252836] p-4 rounded-xl mb-6 outline-none">
                            <option value="UAH">UAH (₴)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>
                        <div className="flex gap-3">
                            <button onClick={() => setView('list')} className="flex-1 p-4 bg-gray-700 rounded-2xl">Cancel</button>
                            <button onClick={onSaveEdit} className="flex-1 p-4 bg-button-gradient rounded-2xl font-bold text-white">Save</button>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

const FeedbackModal = ({ profile, onClose, showToast }: { profile: any, onClose: () => void, showToast: (message: string, type: 'success' | 'error') => void }) => {
    const [message, setMessage] = useState('');
    const { postFeedback, isLoading } = useFeedback();
    const token = localStorage.getItem('access') || sessionStorage.getItem('access') || '';

    const handleSendFeedback = async () => {
        if (!message.trim()) {
            showToast("Please enter some text", "error");
            return;
        }

        try {
            await postFeedback(message, token);
            showToast("Feedback sent to Telegram!", "success");
            setMessage('');
            onClose();
        } catch (err) {
            showToast("Failed to send feedback", "error");
        }
    };

    return (
        <div className="flex flex-col w-full gap-5">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Feedback</h2>
                <p className="text-gray-400 text-sm mt-1">
                    Help us improve. What's on your mind?
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <textarea
                    autoFocus
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or suggestion..."
                    className="w-full bg-[#252836] text-white p-4 rounded-2xl min-h-37.5 outline-none border border-transparent focus:border-[#6B79B5] transition-all resize-none placeholder:text-gray-600"
                />
                <p className="text-[10px] text-gray-500 self-end px-1">
                    Logged as {profile?.username}
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 p-4 bg-[#252836] text-white rounded-xl font-semibold transition-colors hover:bg-[#2d3142]"
                >
                    Cancel
                </button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendFeedback}
                    disabled={isLoading || !message.trim()}
                    className={`flex-1 p-4 rounded-xl font-bold text-white transition-all ${
                        !message.trim() || isLoading 
                        ? 'bg-gray-700 opacity-50 cursor-not-allowed' 
                        : 'bg-button-gradient'
                    }`}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                        "Send"
                    )}
                </motion.button>
            </div>
        </div>
    );
};

const DeleteModal = ({ profile, onClose }: { profile: any, onClose: () => void }) => {
    return (
        <div>
            <p>Damn</p>
        </div>
    )
}

const LogoutModal = ({ onClose }: { onClose: () => void }) => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                <LogOut className="w-8 h-8 text-[#FF5C5C]" />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-white">Log out?</h2>
                <p className="text-gray-400 mt-2">Are you sure you want to log out of your account?</p>
            </div>
            <div className="flex gap-3 w-full">
                <button 
                    onClick={onClose}
                    className="flex-1 bg-[#252836] text-white p-4 rounded-xl font-semibold"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleLogout}
                    className="flex-1 bg-[#FF5C5C] text-white p-4 rounded-xl font-semibold"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

const SettingOption = ({icon, label, onClick, isDanger = false}: {icon: React.ReactNode, label: string, onClick: () => void, isDanger?: boolean}) => {
    return (
        <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="w-full px-4"
            onClick={onClick}
        >
            <div className="w-full flex items-center justify-between bg-[#252836] p-4 rounded-2xl mb-3">
                <div className="flex items-center gap-4">
                    <div className={isDanger ? 'text-[#FF5C5C]' : 'text-gray-400'}>{icon}</div>
                    <p className={`text-lg ${isDanger ? 'text-[#FF5C5C]' : 'text-white'}`}>
                        {label}
                    </p>
                </div>
                <ChevronRight className={`w-5 h-5 ${isDanger ? 'text-[#FF5C5C]' : 'text-white'}`} />
            </div>
        </motion.button>
    )
}

export const SettingPage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { profile, fetchProfile } = useDashboardData();
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState<'profile' | 'password' | '2fa' | 'wallets' | 'feedback' | 'delete' | 'logout' | null>(null);
    const displayName = profile?.first_name 
        ? `${profile.first_name} ${profile.last_name || ''}`.trim() 
        : profile?.username || '';

    const renderModalContent = (activeModal, profile, onClose) => {
        switch (activeModal) {
            case 'profile':
                return <ProfileModal onClose={() => setActiveModal(null)} profile={profile} showToast={showToast} onProfileUpdate={fetchProfile} />;
            case 'password':
                return <PasswordModal onClose={() => setActiveModal(null)} profile={profile} showToast={showToast}/>;
            case '2fa':
                return <AuthModal onClose={() => setActiveModal(null)} profile={profile} showToast={showToast}/>; 
            case 'wallets':
                return <WalletsModal onClose={() => setActiveModal(null)} profile={profile} showToast={showToast}/>;
            case 'feedback':
                return <FeedbackModal onClose={() => setActiveModal(null)} profile={profile} showToast={showToast}/>;
            case 'delete':
                return <DeleteModal onClose={() => setActiveModal(null)} profile={profile} />;
            case 'logout':
                return <LogoutModal onClose={() => setActiveModal(null)} profile={profile} />;
            default:
                return null;
        }
    }

    const { setAvatar, isLoading: isAvatarLoading } = useSetAvatar();
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 2000); 
};

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const token = localStorage.getItem('access') || sessionStorage.getItem('access') || '';
            await setAvatar(token, file);
        
            showToast("Avatar updated successfully!", "success");
            fetchProfile(token); 
        
        } catch (err) {
            showToast("Error uploading image", "error");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <motion.div className='flex items-center justify-between p-4 pt-6 shrink-0 relative'>
                <motion.button onClick={() => {navigate("/"); }}
                    whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} className="bg-[#252836] rounded-2xl p-2 w-12 h-12">
                    <div className="flex items-center justify-center">
                        <ChevronLeft className="w-6 h-6"/>
                    </div>
                </motion.button>
                <h1 className='text-2xl font-bold absolute left-0 right-0 text-center text-white pointer-events-none'>
                    Settings
                </h1>
            </motion.div>
            <motion.div className="flex flex-col">
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/png, image/jpeg"/>
                <motion.div 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()} 
                    className="w-24 h-24 mx-auto rounded-full bg-[#252836] overflow-hidden border-2 border-transparent hover:border-gray-500 cursor-pointer flex items-center justify-center"
                >
                    {profile?.profile_picture ? (
                        <img src={profile.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <Avatar name={displayName} className="w-24 h-24 text-3xl" />
                    )}
                </motion.div>
                <div className="flex flex-col items-center mt-4">
                    {profile?.first_name ? (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-sm text-gray-400 mb-1">@{profile?.username}</p>
                            <div 
                                className="flex items-center gap-2 cursor-pointer group" 
                                onClick={() => setActiveModal('profile')}
                            >
                                <p className="text-xl font-semibold text-white">
                                    {profile?.first_name} {profile?.last_name}
                                </p>
                                <Pencil className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    ) : (
                        <div 
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => setActiveModal('profile')}
                        >
                            <p className="text-xl font-semibold text-white">@{profile?.username}</p>
                            <Pencil className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                    )}
                </div>
            </motion.div>
            <div>
                <p className="text-gray-400 text-sm font-semibold mb-2 px-2 mt-4">Security</p>
                <SettingOption icon={<FingerprintPattern className="w-5 h-5"/>} label="Two-Factor Authentication" onClick={() => setActiveModal('2fa')} />
                <SettingOption icon={<KeyRound className="w-5 h-5"/>} label="Change Password" onClick={() => setActiveModal('password')} />
                <p className="text-gray-400 text-sm font-semibold mb-2 px-2 mt-2">Wallet & Currency</p>
                <SettingOption icon={<Wallet className="w-5 h-5"/>} label="Wallets" onClick={() => setActiveModal('wallets')} />
                <p className="text-gray-400 text-sm font-semibold mb-2 px-2 mt-2">Social</p>
                <SettingOption icon={<MessagesSquare className="w-5 h-5"/>} label="Feedback" onClick={() => setActiveModal('feedback')} />
                <p className="text-gray-400 text-sm font-semibold mb-2 px-2 mt-2">Danger Zone</p>
                <SettingOption icon={<UserX className="w-5 h-5"/>} label="Delete Account" onClick={() => setActiveModal('delete')} isDanger />
                <SettingOption icon={<LogOut className="w-5 h-5"/>} label="Logout" onClick={() => setActiveModal('logout')} />
            </div>
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0"
                            onClick={() => setActiveModal(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1C1F2C] w-full max-w-sm rounded-3xl p-6 relative z-10"
                        >
                            {renderModalContent(activeModal, profile, () => setActiveModal(null))}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-10 left-1/2 -translate-x-1/2 z-100 px-6 py-4 rounded-full bg-[#2C3345] shadow-xl flex items-center gap-3 w-max max-w-[90vw]"
                    >
                        {toast.type === 'success' ? (
                            <CircleCheck className="w-6 h-6 text-[#8BFF74] shrink-0" />
                        ) : (
                            <CircleX className="w-6 h-6 text-[#FF5C5C] shrink-0" />
                        )}
                        <span 
                            className={`text-lg font-medium tracking-wide ${
                            toast.type === 'success' ? 'text-[#8BFF74]' : 'text-[#FF5C5C]'}`}
                        >
                            {toast.message}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}