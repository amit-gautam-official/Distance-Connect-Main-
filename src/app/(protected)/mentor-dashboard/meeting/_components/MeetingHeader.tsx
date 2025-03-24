"use client"
import Image from 'next/image';
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu"

function MeetingHeader() {

    return (
        <div className='p-4 px-10'>
            <div >
                <DropdownMenu>
                   
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    )
}

export default MeetingHeader