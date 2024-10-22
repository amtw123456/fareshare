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


    // Function to fetch transaction entries
    const fetchTransactionEntries = async () => {
        console.log(userId)
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction_entries/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token if needed
                },
            });
            console.log(response.data)
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

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
            <NavigationBar />
            <div className='flex justify-center mt-5'>
                <div className='flex flex-col justify-center items-center'>
                    <CreateTransactionModal />
                    <div className='mt-5 space-y-4'>
                        {loading ? ( // Show loading state
                            <CircularProgress color={'secondary'} label="Loading transaction entries" />
                        ) : (
                            transactionEntries.map((transactionEntry) => (
                                <>
                                    <TransactionEntryCard key={transactionEntry.id} transactionEntry={transactionEntry} showDropDownSettings={true} />
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
