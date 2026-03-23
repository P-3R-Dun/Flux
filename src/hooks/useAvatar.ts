const gradients = [
    "from-blue-600 to-indigo-700",
    "from-cyan-500 to-blue-600",
    "from-indigo-500 to-purple-600",
    "from-slate-700 to-slate-900",
    "from-emerald-500 to-teal-700",
    "from-lime-400 to-green-600",
    "from-teal-400 to-cyan-600",
    "from-rose-500 to-red-700",
    "from-orange-400 to-pink-600",
    "from-amber-400 to-orange-600",
    "from-fuchsia-600 to-purple-700",
    "from-violet-600 to-indigo-900",
]

export const useAvatar = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const gradientSelected = gradients[charSum % gradients.length];
    return { initials, gradientSelected };
}