import authAmbient from '../assets/sounds/auth-ambient.mp3'
import buttonSound from '../assets/sounds/button.mp3'
import errorSound from '../assets/sounds/error.mp3'
import successSound from '../assets/sounds/success.mp3'

const soundsArray= {
    'BUTTON_SOUND': new Audio(buttonSound),
    'ERROR_SOUND': new Audio(errorSound),
    'AUTH_AMBIENT': new Audio(authAmbient),
    'SUCCESS_SOUND': new Audio(successSound),
}
type soundName = keyof typeof soundsArray

export const useSound = () => {
    const play = (currentSound: soundName, loop: boolean = false) =>{
        const audioInstance =  soundsArray[currentSound].cloneNode(true) as HTMLAudioElement

        audioInstance.volume = 0.5
        audioInstance.loop = loop
        if (!loop) {
            audioInstance.currentTime = 0
        } 

        audioInstance.play()
        return audioInstance
    }

    return { play };
}