'use client'
import { DialogContent } from '@radix-ui/react-dialog';
import React from 'react'
import { set } from 'zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Dialog, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import useProjects from '~/hooks/use-projects';

const AskQuestion = () => {
  const {project} = useProjects();
  const [question, setQuestion] = React.useState('');
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
const onSubmit = (e: React.FormEvent) => {
  e.preventDefault();
 setIsDialogOpen(true);
};
    return (
        <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader> 
            <DialogTitle>Ask A Question</DialogTitle>
        </DialogHeader>
        <DialogContent>
           
        </DialogContent>
        </Dialog>
        <Card className='relative col-span-1 md:col-span-2 lg:col-span-2'>
            <CardHeader>
                <CardTitle className='text-lg font-semibold' >Ask a Question</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className='flex flex-col gap-2'>
                    <textarea placeholder='' value={question} onChange={(e) => setQuestion(e.target.value)} />
                  <div className='h-4'>
                      <Button type='submit'>Ask Ai</Button>
                  </div>
                </form>
            </CardContent>
        </Card>
        </>
  )
}

export default AskQuestion