import React, { useCallback, useMemo } from 'react';
import { useAccessibility } from '../useAccessibility';

const accessibilityDefaults = {
    fontSize: { event: 'AccessibilityOnChangeOptionFontSize', defaultValue: 1, valueKey: 'zoom', setKey: 'AccessibilityFontSizeSet', toggleKey: 'AccessibilityFontSizeLevelUp' },
    underline: { event: 'AccessibilityOnChangeOptionUnderline', defaultValue: false, valueKey: 'underline', setKey: 'AccessibilityUnderlineSet', toggleKey: 'AccessibilityUnderlineToggle' },
    letterSpacing: {
        event: 'AccessibilityOnChangeOptionLetterSpacing',
        defaultValue: 1,
        valueKey: 'letter-spacing',
        setKey: 'AccessibilityLetterSpacingSet',
        toggleKey: 'AccessibilityLetterSpacingLevelUp',
    },
    lineHeight: { event: 'AccessibilityOnChangeOptionLineHeight', defaultValue: 1, valueKey: 'line-height', setKey: 'AccessibilityLineHeightSet', toggleKey: 'AccessibilityLineHeightLevelUp' },
    textToSpeech: {
        event: 'AccessibilityOnChangeOptionTextToSpeech',
        defaultValue: false,
        valueKey: 'text-to-speech',
        setKey: 'AccessibilityTextToSpeechSet',
        toggleKey: 'AccessibilityTextToSpeechToggle',
    },
    contrasted: { event: 'AccessibilityOnChangeOptionContrast', defaultValue: false, valueKey: 'contrasted', setKey: 'AccessibilityContrastSet', toggleKey: 'AccessibilityContrastToggle' },
    inverted: { event: 'AccessibilityOnChangeOptionInvertColor', defaultValue: false, valueKey: 'inverted', setKey: 'AccessibilityInvertColorSet', toggleKey: 'AccessibilityInvertColorToggle' },
    enlargeCursor: {
        event: 'AccessibilityOnChangeOptionEnlargeCursor',
        defaultValue: false,
        valueKey: 'enlarge-cursor',
        setKey: 'AccessibilityEnlargeCursorSet',
        toggleKey: 'AccessibilityEnlargeCursorToggle',
    },
    showLine: { event: 'AccessibilityOnChangeOptionShowLine', defaultValue: false, valueKey: 'show-line', setKey: 'AccessibilityShowLineSet', toggleKey: 'AccessibilityShowLineToggle' },
    dyslexicFont: { event: 'AccessibilityOnChangeOptionDyslexic', defaultValue: false, valueKey: 'dyslexic', setKey: 'AccessibilityDyslexicSet', toggleKey: 'AccessibilityDyslexicToggle' },
    disableAnimations: {
        event: 'AccessibilityOnChangeOptionDisableAnimations',
        defaultValue: false,
        valueKey: 'disable-animations',
        setKey: 'AccessibilityDisableAnimationsSet',
        toggleKey: 'AccessibilityDisableAnimationsToggle',
    },
    hideMedia: { event: 'AccessibilityOnChangeOptionHideMedia', defaultValue: false, valueKey: 'hide-media', setKey: 'AccessibilityHideMediaSet', toggleKey: 'AccessibilityHideMediaToggle' },
    saturation: { event: 'AccessibilityOnChangeOptionSaturation', defaultValue: 1, valueKey: 'saturation', setKey: 'AccessibilitySaturationSet', toggleKey: 'AccessibilitySaturationLevelUp' },
    motorImpaired: {
        event: 'AccessibilityOnChangeProfileMotorImpaired',
        defaultValue: false,
        valueKey: 'mi',
        setKey: 'AccessibilityProfileMotorImpairedSet',
        toggleKey: 'AccessibilityProfileMotorImpairedToggle',
    },
    blindness: { event: 'AccessibilityOnChangeProfileBlind', defaultValue: false, valueKey: 'bl', setKey: 'AccessibilityProfileBlindSet', toggleKey: 'AccessibilityProfileBlindToggle' },
    colorBlind: {
        event: 'AccessibilityOnChangeProfileColorBlind',
        defaultValue: false,
        valueKey: 'cb',
        setKey: 'AccessibilityProfileColorBlindSet',
        toggleKey: 'AccessibilityProfileColorBlindToggle',
    },
    dyslexia: { event: 'AccessibilityOnChangeProfileDyslexia', defaultValue: false, valueKey: 'ds', setKey: 'AccessibilityProfileDyslexiaSet', toggleKey: 'AccessibilityProfileDyslexiaToggle' },
    lowVision: { event: 'AccessibilityOnChangeProfileLowVision', defaultValue: false, valueKey: 'lv', setKey: 'AccessibilityProfileLowVisionSet', toggleKey: 'AccessibilityProfileLowVisionToggle' },
    epilepsy: { event: 'AccessibilityOnChangeProfileEpileptic', defaultValue: false, valueKey: 'ep', setKey: 'AccessibilityProfileEpilepticSet', toggleKey: 'AccessibilityProfileEpilepticToggle' },
    adhd: { event: 'AccessibilityOnChangeProfileAdhd', defaultValue: false, valueKey: 'ad', setKey: 'AccessibilityProfileAdhdSet', toggleKey: 'AccessibilityProfileAdhdToggle' },
    cognitiveAndLearning: {
        event: 'AccessibilityOnChangeProfileCognitiveAndLearning',
        defaultValue: false,
        valueKey: 'cal',
        setKey: 'AccessibilityProfileCognitiveAndLearningSet',
        toggleKey: 'AccessibilityProfileCognitiveAndLearningToggle',
    },
} as const;

type AccessibilityMap = typeof accessibilityDefaults;
type InferedReturn<K extends keyof AccessibilityMap> = AccessibilityMap[K]['defaultValue'] extends false ? boolean : number;

export function useAccessibilityValue<K extends keyof AccessibilityMap>(key: K) {
    const { event, valueKey, setKey, toggleKey } = accessibilityDefaults[key];
    const { accessibility } = useAccessibility();
    const [state, setState] = React.useState<InferedReturn<K>>(accessibility.getAction(valueKey) as InferedReturn<K>);
    accessibility.getAction('zoom');

    React.useEffect(() => {
        function update(e: CustomEvent) {
            setState(e.detail.value);
        }
        window.addEventListener(event, update);
        return () => window.removeEventListener(event, update);
    }, [event]);

    const handleChange = useCallback(
        (newValue: InferedReturn<K>) => {
            accessibility.emit(setKey, newValue);
        },
        [setKey, accessibility]
    );
    const handleToggle = useCallback(() => {
        accessibility.emit(toggleKey);
    }, [toggleKey, accessibility]);

    return useMemo(() => [state, handleChange, handleToggle] as const, [state, handleChange, handleToggle]);
}
