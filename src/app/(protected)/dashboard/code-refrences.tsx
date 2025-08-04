import { TabsContent } from '@radix-ui/react-tabs';
import React from 'react'
import { Tabs } from '~/components/ui/tabs';
import { Prism as SyntaxHighlter } from 'react-syntax-highlighter';
import {lucario} from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
    filesReferences: { fileName: string; sourceCode: string; summary: string }[]
}
const CodeReferences = ({ filesReferences }: Props) => {
    const [tab, setTab] = React.useState(filesReferences[0]?.fileName || '');
    if(!filesReferences || filesReferences.length === 0) {
        return (
            <div>
                <h2>No Code References Available</h2>
            </div>
        )
    }
  return (
    <div className='max-w-[70vw] '>
        <Tabs value={tab} onValueChange={setTab}>
          <div className='overflow-scroll flex gap-2 bg-gray-200 p-1 rounded-md'>
            {filesReferences.map((file) => (
           <button key={file.fileName} onClick={() => setTab(file.fileName)} className={`px-4 py-2 rounded-md ${tab === file.fileName ? 'bg-gray-300' : 'hover:bg-gray-300'}`}>
             {file.fileName}
           </button>
            ))}
          </div>
          {filesReferences.map(file=>(
            <TabsContent key={file.fileName} value={file.fileName} className='max-h-[40vh] overflow-scroll max-w-7xl rounded-md p-4 bg-white'>
                <SyntaxHighlter language='typescript' style={lucario}>
                    {file.sourceCode}
                </SyntaxHighlter>
            </TabsContent>))}
        </Tabs>
      <h2>Code References</h2>
    </div>
  )
}

export default CodeReferences