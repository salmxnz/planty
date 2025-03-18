import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableWithoutFeedback,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Alert } from 'react-native'
import { supabase } from '../../utils/supabase'
import { useAuth } from '@/context/AuthProvider'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { icons } from '@/constants'
import Markdown from 'react-native-markdown-display'
import * as ImagePicker from 'expo-image-picker'
import 'react-native-get-random-values'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import { v4 as uuidv4 } from 'uuid'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useColorScheme } from 'react-native'
import { Keyboard, Dimensions } from 'react-native'

const newUUID = uuidv4()
const genAI = new GoogleGenerativeAI(
    process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

interface Message {
    text: string
    isUser: boolean
    timestamp: Date
    image?: string | null
}

const MessageScreen = () => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [history, setHistory] = useState<{
        [date: string]: { chat_session_id: string; text: string }[]
    }>({})
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [chatSessionId, setChatSessionId] = useState<string | null>(null)
    const { session } = useAuth()
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const scrollViewRef = useRef<ScrollView>(null)
    const [keyboardVisible, setKeyboardVisible] = useState(false)
    const [keyboardHeight, setKeyboardHeight] = useState(0)

    const colorScheme = useColorScheme();

    const tintcolor = colorScheme === 'light' ? '#fff' : '#000'

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (event) => {
                setKeyboardVisible(true);
                if (Platform.OS === 'android') {
                    setKeyboardHeight(event.endCoordinates.height);
                }
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, Platform.OS === 'ios' ? 50 : 100);
            }
        );
        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                if (Platform.OS === 'android') {
                    setKeyboardHeight(0);
                }
            }
        );

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    useEffect(() => {
        console.log('Session in MessageScreen:', session)
    }, [session])

    const handleSend = async () => {
        if (!input.trim() && !selectedImage) return
        if (!session || !session.user) {
            console.error('User is not authenticated.')
            return
        }

        let currentSessionId = chatSessionId
        let isNewSession = false

        if (!currentSessionId) {
            currentSessionId = uuidv4()
            setChatSessionId(currentSessionId)
            isNewSession = true
        }

        let imageUrl = null
        if (selectedImage) {
            imageUrl = await uploadImage(selectedImage)
            setSelectedImage(null)
        }

        const userMessage = {
            text: input,
            image: imageUrl,
            isUser: true,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])

        try {
            setIsLoading(true)

            if (isNewSession) {
                await supabase.from('chat_sessions').insert([
                    {
                        user_id: session.user.id,
                        chat_session_id: currentSessionId,
                        title: input || 'Image Message',
                    },
                ])
            }

            await supabase.from('messages').insert([
                {
                    user_id: session.user.id,
                    chat_session_id: currentSessionId,
                    text: input,
                    image: imageUrl,
                    is_user: true,
                },
            ])

            setInput('')

            if (input.trim()) {
                const chat = model.startChat({
                    history: [
                        {
                            role: 'user',
                            parts: [
                                {
                                    text: 'You are a plant expert. Only answer questions related to greetings, plants, fruits, vegetables, trees, flowers, leaves, gardening, botany, and nature. If a question is unrelated, politely ask the user to stay on topic.',
                                },
                            ],
                        },
                        ...messages.map((msg) => ({
                            role: msg.isUser ? 'user' : 'model',
                            parts: [{ text: msg.text }],
                        })),
                    ],
                    generationConfig: { temperature: 0.7 },
                })

                const result = await chat.sendMessage(input)
                const text = await result.response.text()

                const aiMessage = { text, isUser: false, timestamp: new Date() }
                setMessages((prev) => [...prev, aiMessage])

                await supabase.from('messages').insert([
                    {
                        user_id: session.user.id,
                        chat_session_id: currentSessionId,
                        text,
                        is_user: false,
                    },
                ])
            }
        } catch (error) {
            console.error('Message sending error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleNewChat = () => {
        const newSessionId = uuidv4()
        setChatSessionId(newSessionId)
        setMessages([])
        setInput('')
    }

    //History part
    const handleHistory = async () => {
        if (!session || !session.user) {
            console.error('User is not authenticated.')
            return
        }

        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('user_id', session.user.id)
                .eq('is_user', true)
                .order('chat_session_id', { ascending: true })
                .order('created_at', { ascending: true })

            if (error) throw error

            const sessionMap = new Map()
            for (const msg of data) {
                if (!sessionMap.has(msg.chat_session_id)) {
                    sessionMap.set(msg.chat_session_id, msg)
                }
            }

            const firstMessages = Array.from(sessionMap.values())

            const groupedHistory = firstMessages.reduce((acc, msg) => {
                const dateKey = new Date(msg.created_at).toDateString()
                if (!acc[dateKey]) acc[dateKey] = []
                acc[dateKey].push(msg)
                return acc
            }, {})

            setHistory(groupedHistory)
            setIsHistoryOpen(true)

            if (firstMessages.length > 0 && !chatSessionId) {
                setChatSessionId(firstMessages[0].chat_session_id)
            }
        } catch (error) {
            console.error('Error fetching history:', error)
        }
    }

    const loadChatSession = async (sessionId: string) => {
        setIsHistoryOpen(false)
        setChatSessionId(sessionId)

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_session_id', sessionId)
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching chat session:', error)
            return
        }

        setMessages(
            data.map((msg) => ({
                text: msg.text,
                isUser: msg.is_user,
                timestamp: new Date(msg.created_at),
            })),
        )
    }

    //Delete part
    const confirmDeleteChat = (sessionId: string) => {
        Alert.alert(
            'Delete Chat',
            'Are you sure you want to delete this chat? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => handleDeleteChat(sessionId),
                    style: 'destructive',
                },
            ],
        )
    }

    const handleDeleteChat = async (sessionId: string) => {
        if (!session || !session.user) {
            console.error('User is not authenticated.')
            return
        }

        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('chat_session_id', sessionId)
                .eq('user_id', session.user.id)

            if (error) throw error

            setHistory((prevHistory) => {
                const updatedHistory = { ...prevHistory }
                Object.keys(updatedHistory).forEach((date) => {
                    updatedHistory[date] = updatedHistory[date].filter(
                        (chat) => chat.chat_session_id !== sessionId,
                    )
                    if (updatedHistory[date].length === 0)
                        delete updatedHistory[date]
                })
                return updatedHistory
            })

            if (chatSessionId === sessionId) {
                setChatSessionId(null)
                setMessages([])
            }

            console.log('Chat session deleted successfully.')
        } catch (error) {
            console.error('Error deleting chat session:', error)
        }
    }

    const confirmDeleteAllChats = () => {
        Alert.alert(
            'Delete All Chat History',
            'Are you sure you want to delete all chat history? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: handleDeleteAllChats,
                    style: 'destructive',
                },
            ],
        )
    }

    const handleDeleteAllChats = async () => {
        if (!session || !session.user) {
            console.error('User is not authenticated.')
            return
        }

        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('user_id', session.user.id)

            if (error) throw error

            setHistory({})
            setChatSessionId(null)
            setMessages([])

            console.log('All chat history deleted successfully.')
        } catch (error) {
            console.error('Error deleting all chat history:', error)
        }
    }

    //Image part
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        })

        if (!result.canceled && result.assets?.length > 0) {
            const selectedUri = result.assets[0].uri
            console.log('Selected Image URI:', selectedUri)
            setSelectedImage(selectedUri)
        } else {
            console.log('Image selection canceled.')
        }
    }
    const uploadImage = async (uri: string) => {
        try {
            console.log('Starting image upload...')

            const bucketName = 'chat-images'

            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            })

            const arrayBuffer = decode(base64)
            const fileExtension = uri.split('.').pop()?.toLowerCase() || 'jpg'
            const fileName = `${uuidv4()}.${fileExtension}`
            const filePath = `${bucketName}/${fileName}`

            console.log('Uploading image:', filePath)

            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, arrayBuffer, {
                    contentType: `image/${fileExtension}`,
                })

            if (error) {
                console.error('Supabase upload error:', error)
                throw error
            }

            console.log('Upload successful:', data)

            const { data: publicUrlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath)

            if (!publicUrlData) {
                console.error('Failed to retrieve public URL.')
                return null
            }

            console.log('Public URL:', publicUrlData.publicUrl)
            return publicUrlData.publicUrl
        } catch (error) {
            console.error('Image upload error:', error)
            return null
        }
    }

    const markdownStyles = {
        body: {
            color: '#333',
        },
        heading1: {
            fontSize: 24,
            marginTop: 12,
            marginBottom: 6,
            fontWeight: 'bold',
        },
        heading2: {
            fontSize: 20,
            marginTop: 10,
            marginBottom: 5,
            fontWeight: 'bold',
        },
        paragraph: {
            marginTop: 4,
            marginBottom: 8,
            lineHeight: 20,
        },
        link: {
            color: '#0066cc',
        },
        list: {
            marginBottom: 8,
        },
        listItem: {
            marginBottom: 4,
        },
        code_block: {
            backgroundColor: '#f5f5f5',
            padding: 8,
            borderRadius: 4,
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            fontSize: 14,
        },
        code_inline: {
            backgroundColor: '#f5f5f5',
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            fontSize: 14,
            padding: 2,
        },
    }

    const darkMarkdownStyles = {
        ...markdownStyles,
        body: {
            color: '#e0e0e0',
        },
        code_block: {
            backgroundColor: '#2a2a2a',
            padding: 8,
            borderRadius: 4,
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            fontSize: 14,
        },
        code_inline: {
            backgroundColor: '#2a2a2a',
            fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            fontSize: 14,
            padding: 2,
        },
    }

    return (
        <SafeAreaView className="flex-1 bg-primary-light dark:bg-primary-dark">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <TouchableWithoutFeedback
                    onPress={() => setIsHistoryOpen(false)}
                    accessible={false}
                >
                    <View className="flex-1">
                        <View className="flex-row items-center justify-between p-4 border-gray-200 dark:border-gray-800">
                            <Text className="text-3xl font-bold text-primary-dark dark:text-white text-center">
                                Messages
                            </Text>
                            <View className="flex-row">
                                <TouchableOpacity
                                    onPress={handleNewChat}
                                    className="w-12 h-12 bg-accent-light dark:bg-[#B4F58D] rounded-full items-center justify-center mr-2"
                                >
                                    <Image
                                        source={icons.chatBubble}
                                        className="w-8 h-8"
                                        tintColor={tintcolor}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleHistory}
                                    className="w-12 h-12 bg-accent-light dark:bg-[#B4F58D] rounded-full items-center justify-center"
                                >
                                    <Image
                                        source={icons.history}
                                        className="w-8 h-8"
                                        tintColor={tintcolor}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Content Area */}
                        <View className="flex-1">
                            <ScrollView
                                ref={scrollViewRef}
                                className="flex-1 p-4"
                                contentContainerStyle={{ 
                                    paddingBottom: keyboardVisible ? 20 : 100 
                                }}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={true}
                            >
                                {messages.length === 0 ? (
                                    <View className="items-center justify-center py-8">
                                        <Text className="text-gray-500 dark:text-gray-400 text-center text-lg mb-6">
                                            Welcome to Plant Assistant! Ask me
                                            any questions about plant care,
                                            identification, or gardening tips.
                                        </Text>
                                        {/* <Text className="text-gray-500 dark:text-gray-400 text-center text-lg mb-6">
                                            Ask me anything!
                                        </Text> */}
                                    </View>
                                ) : (
                                    messages.map((message, index) => (
                                        <View
                                            key={index}
                                            className={`mb-4 flex-row ${
                                                message.isUser
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }`}
                                        >
                                            {message.isUser ? (
                                                <View className="max-w-[80%] rounded-2xl p-3 bg-accent-light dark:bg-accent-dark">
                                                    {message.image && (
                                                        <Image
                                                            source={{
                                                                uri: message.image,
                                                            }}
                                                            className="w-40 h-40 rounded-lg mb-2"
                                                            resizeMode="cover"
                                                        />
                                                    )}
                                                    <Text className="text-white dark:text-primary-dark">
                                                        {message.text}
                                                    </Text>
                                                    <Text className="text-xs mt-1 text-gray-200 dark:text-gray-700">
                                                        {new Date(
                                                            message.timestamp,
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </Text>
                                                </View>
                                            ) : (
                                                <View className='flex-row'>
                                                    <View className='w-8 h-8 bg-primary-dark dark:bg-primary-light mr-3 items-center justify-center rounded-full'></View>
                                                    <View className="max-w-[80%] pl-1 bg-gray-200 dark:bg-gray-300 px-3 py-2 rounded-2xl">
                                                        {message.image && (
                                                            <Image
                                                                source={{
                                                                    uri: message.image,
                                                                }}
                                                                className="w-40 h-40 rounded-lg mb-2"
                                                                resizeMode="cover"
                                                            />
                                                        )}
                                                        {/* <Markdown
                                                            style={
                                                                Platform.OS ===
                                                                'ios'
                                                                    ? markdownStyles
                                                                    : darkMarkdownStyles
                                                            }
                                                        > */}
                                                            <Text className="text-primary-dark dark:text-primary-dark px-2 pt-1">{message.text}</Text>
                                                        {/* </Markdown> */}
                                                        <Text className="text-xs mx-2 text-gray-500 dark:text-gray-600">
                                                            {new Date(
                                                                message.timestamp,
                                                            ).toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    ))
                                )}

                                {/* AI Thinking */}
                                {isLoading && (
                                    <View className="mb-4 flex-row justify-start ">
                                        <View className='w-8 h-8 bg-primary-dark dark:bg-primary-light mr-3 items-center justify-center rounded-full'></View>
                                        <View className="w-12 h-12 bg-gray-200 dark:bg-gray-300 rounded-xl items-center justify-center">
                                            <Text className="text-black dark:text-black">
                                                ...
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </ScrollView>

                            <View className={`absolute ${keyboardVisible ? 'bottom-0' : 'bottom-28'} left-0 right-0 bg-primary-light dark:bg-primary-dark pt-2 pb-2 px-2 z-10 border-t border-gray-200 dark:border-gray-700`} style={Platform.OS === 'android' && keyboardVisible ? { bottom: 0 } : {}}>
                                <View className="flex-row items-center">
                                    <TouchableOpacity
                                        onPress={pickImage}
                                        className="p-3 mr-2 bg-gray-200 dark:bg-gray-700 rounded-full"
                                    >
                                        <Image
                                            source={icons.plus}
                                            className="w-6 h-6"
                                            tintColor={tintcolor === '#fff' ? '#000' : '#fff'}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>

                                    <TextInput
                                        className="flex-1 h-14 px-4 mr-2 mt-1 rounded-full bg-gray-200 dark:bg-gray-800 text-primary-dark dark:text-white"
                                        placeholder="Ask me about plants..."
                                        placeholderTextColor="#969ba3"
                                        value={input}
                                        onChangeText={setInput}
                                        onSubmitEditing={handleSend}
                                    />
                                    <TouchableOpacity
                                        onPress={handleSend}
                                        className="p-3 rounded-full bg-accent-light dark:bg-[#89ff54]"
                                        disabled={isLoading}
                                    >
                                        {icons.send ? (
                                            <Image
                                                source={icons.send}
                                                className="w-6 h-6"
                                                tintColor={tintcolor}
                                                resizeMode="contain"
                                            />
                                        ) : (
                                            <Text className="text-white">
                                                Send
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* </View> */}
                </TouchableWithoutFeedback>

                {isHistoryOpen && (
                    <TouchableWithoutFeedback
                        onPress={() => setIsHistoryOpen(false)}
                    >
                        <View className="absolute right-0 w-72 h-full bg-primary-light dark:bg-primary-dark p-4 z-10 border-l border-gray-200 dark:border-gray-800">
                            <Text className="text-xl font-semibold text-primary-dark dark:text-white mb-4">
                                History
                            </Text>

                            {/* Delete All History Button (Placed at the Top) */}
                            <View className="mb-4 border-b border-gray-300 dark:border-gray-700 pb-4">
                                <TouchableOpacity
                                    onPress={confirmDeleteAllChats}
                                    className="p-3 bg-red-600 rounded-lg"
                                >
                                    <Text className="text-white text-center font-semibold">
                                        Delete All History
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Scrollable Chat History */}
                            <ScrollView
                                keyboardShouldPersistTaps="handled"
                                className="flex-1"
                            >
                                {Object.keys(history).map((date, index) => (
                                    <View key={index} className="mb-4">
                                        <Text className="text-lg font-semibold text-primary-dark dark:text-white mb-2">
                                            {date}
                                        </Text>
                                        {history[date].map(
                                            (chat, chatIndex) => (
                                                <View
                                                    key={chatIndex}
                                                    className="flex-row justify-between items-center mb-2"
                                                >
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            loadChatSession(
                                                                chat.chat_session_id,
                                                            )
                                                        }
                                                        className="flex-1"
                                                    >
                                                        <Text className="text-gray-500 dark:text-gray-400">
                                                            {chat.text
                                                                .split(' ')
                                                                .slice(0, 5)
                                                                .join(' ')}
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            confirmDeleteChat(
                                                                chat.chat_session_id,
                                                            )
                                                        }
                                                        className="ml-2 p-1"
                                                    >
                                                        <Image
                                                            source={icons.trash}
                                                            className="w-4 h-4"
                                                            tintColor="red"
                                                            resizeMode="contain"
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            ),
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default MessageScreen
