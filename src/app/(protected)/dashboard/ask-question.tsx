'use client'
import { ShieldQuestion } from 'lucide-react';
import React from 'react'
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import useProjects from '~/hooks/use-projects';
import { askQuestion } from './action';
import { readStreamableValue } from '@ai-sdk/rsc';
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from './code-refrences';
const AskQuestion = () => {
  const {project} = useProjects();
  const [question, setQuestion] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [fileReferences, setFileReferences] = React.useState<{fileName:string ; sourceCode: string ; summary: string  }[]>([]);
    const [answer, setAnswer] = React.useState<string>('');
    
    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('');
        setFileReferences([]);
        if(!project?.id) return
  e.preventDefault();
  const {output, fileReferences} =await askQuestion(question, project.id);
  console.log("File references:", fileReferences, 'output:', output);
  setIsDialogOpen(true);
  await setFileReferences(fileReferences); 
    for await( const delta of readStreamableValue(output)) {
        if(delta) setAnswer((prev) => prev + delta);
    }
    setLoading(false);
}
    return (
        <>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className='sm:max-w-[80vw] max-h-[80vh] overflow-scroll'>
                <DialogHeader> 
                    <DialogTitle className="flex items-center">
                        <ShieldQuestion className='mr-2 h-4 w-4' />
                        Ask AI Question
                    </DialogTitle>
                </DialogHeader>
                 <MDEditor.Markdown source={answer} className='max-w-[70vw] !h-full max-h-[50vh] overflow-scroll' />
                 <CodeReferences filesReferences={fileReferences} />
                 <Button type='button' onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogContent>
        </Dialog>
        <Card className='relative col-span-1 md:col-span-2 lg:col-span-2'>
            <CardHeader>
                <CardTitle className='text-lg font-semibold'>Ask a Question</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} >
                    <textarea 
                        className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                        placeholder='What would you like to know about this project?' 
                        value={question} 
                        onChange={(e) => setQuestion(e.target.value)} 
                    />
                    <div className='flex justify-end'>
                        <Button type='submit' disabled={!question.trim()}>Ask AI</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
        </>
  )
}

export default AskQuestion