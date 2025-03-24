import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { CalendarCheck, Clock, Timer } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
  

type ScheduledMeeting = {
  selectedTime: string;
  userNote: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  duration: number;
  meetUrl: string;
  mentorUserId: string;
  selectedDate: Date;
  formatedDate: string;
  formatedTimeStamp: string;
  eventId: string;
  studentUserId: string;
}

function ScheduledMeetingList({meetingList} : {meetingList : ScheduledMeeting[]}) {
  return (
    <div>
        {meetingList&&meetingList.map((meeting,index)=>(
            <Accordion type="single" collapsible key={index}>
            <AccordionItem value="item-1">
                <AccordionTrigger>{meeting?.formatedDate}</AccordionTrigger>
                <AccordionContent>
                    <div>
                    <div className='mt-5 flex flex-col gap-4'>
                    <h2 className='flex gap-2'><Clock/>{meeting?.duration} Min </h2>
                    <h2 className='flex gap-2'><CalendarCheck/>{meeting.formatedDate}  </h2>
                  <h2 className='flex gap-2'><Timer/>{meeting.selectedTime}  </h2>
                  
                    <Link href={meeting?.meetUrl?meeting?.meetUrl:'#'}
                    className='text-primary'
                    >{meeting?.meetUrl}</Link>
                </div>
               <Link href={meeting.meetUrl}>
               <Button className="mt-5">Join Now</Button>
                </Link> 
                    </div>
                </AccordionContent>
            </AccordionItem>
            </Accordion>
        ))}
        

    </div>
  )
}

export default ScheduledMeetingList