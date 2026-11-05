import {topicDecks} from './topicDecks';
import {additionalDecks} from './additionalDecks';
import {wordKey} from './vocabularyProgress';

/** Stable folder/deck IDs. Original deck IDs and existing word progress are preserved. */
export const deckFolders=topicDecks.map((original,index)=>{
  const extra=additionalDecks[index];
  const existing=new Set(original.words.map(w=>wordKey(w.es)));
  const words=[...original.words];
  for(const word of extra.words)if(words.length<25&&!existing.has(wordKey(word.es))){words.push(word);existing.add(wordKey(word.es))}
  if(words.length<25)throw new Error('Deck must have 25 cards: '+original.id);
  return {id:original.id,title:original.title,icon:extra.icon,decks:[
    {...original,title:original.title+' · Essentials',words},
    {id:extra.id,title:extra.title,words:extra.words}
  ]};
});
export const allTopicDecks=deckFolders.flatMap(folder=>folder.decks);
export function folderProgress(folder,completions={}){
  const finished=folder.decks.filter(d=>Boolean(completions[d.id])).length;
  return {finished,total:folder.decks.length,percent:Math.round(finished/folder.decks.length*100)};
}
