"use client";

import { useState, useEffect } from 'react';
import CreateTransactionModal from "../components/CreateTransactionModel/CreateTransactionModal";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NavigationBar from '../components/NavigationBar/NavigationBar';
import TransactionEntryCard from '../components/TransactionEntryCard/TransactionEntryCard';
import { CircularProgress } from '@nextui-org/react';

interface TransactionEntry {
    id: number;
    lat: number;
    long: number;
    title: string;
    amount: number;
    user_id: number;
    created_at: string;
    description: string;
}


const Profile = () => {
    const { token, userId } = useAuth(); // Use your authentication context
    const [transactionEntries, setTransactionEntries] = useState<TransactionEntry[]>([]); // State to hold transaction entries
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [isRefreshTransactionEntries, setIsRefreshTransactionEntries] = useState<boolean>(false); // State to track if button is pressed

    const fetchTransactionEntries = async () => {
        console.log(userId)
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction_entries/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token if needed
                },
            });
            setTransactionEntries(response.data); // Set the state with fetched data
        } catch (error) {
            console.error("Error fetching transaction entries:", error);
            // Handle error here (e.g., show a message to the user)
        } finally {
            setLoading(false); // Set loading to false after request completion
        }
    };

    // Fetch transaction entries on component mount or userId change
    useEffect(() => {
        if (userId) {
            fetchTransactionEntries(); // Call the function to fetch entries
        }
    }, [userId]);

    useEffect(() => {

        fetchTransactionEntries();

    }, [isRefreshTransactionEntries]);

    useEffect(() => {
        console.log(transactionEntries)
        setIsRefreshTransactionEntries(false)
    }, [transactionEntries]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
            <NavigationBar />
            <div className='flex justify-center mt-5'>
                <div className="flex flex-col justify-center items-center w-full max-w-[600px] mx-auto"> {/* Centered with max width */}
                    <CreateTransactionModal setIsRefreshTransactionEntries={setIsRefreshTransactionEntries} />
                    <div className='w-full mt-5 space-y-4'>
                        {loading ? ( // Show loading state
                            <div className='flex justify-center'>
                                <CircularProgress color={'secondary'} label="Loading transaction entries" />
                            </div>
                        ) : (
                            transactionEntries.map((transactionEntry) => (
                                <>
                                    <TransactionEntryCard key={transactionEntry.id} transactionEntry={transactionEntry} showDropDownSettings={true} setIsRefreshTransactionEntries={setIsRefreshTransactionEntries} />
                                </>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
