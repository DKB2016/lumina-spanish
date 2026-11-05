/** CEFR-aligned practice prompts, NOT an official proficiency certification. */
export const levels=[
{id:'A1',target:75,stories:8,description:'Introduce yourself and manage simple everyday exchanges.',tasks:[
{skill:'Listening',prompt:'Listen to a short conversation at a café. What does the customer order?',audio:'Hola, buenos días. Quiero un café con leche y un pan, por favor.',question:'What did the customer order?',options:['Coffee with milk and bread','Tea and fruit','Water and soup'],answer:0},
{skill:'Reading',passage:'Me llamo Ana. Vivo en Puebla con mi hermano. Trabajo por la mañana y estudio español por la tarde.',prompt:'Where does Ana live?',options:['Puebla','Monterrey','Oaxaca'],answer:0},
{skill:'Writing',prompt:'Write 4–6 Spanish sentences introducing yourself: name, where you live, your daily routine, and something you like.'},
{skill:'Speaking',prompt:'Speak for 30–60 seconds: introduce yourself, say where you are from, and describe your typical morning.'}]},
{id:'A2',target:300,stories:20,description:'Describe familiar situations, routines, and recent experiences.',tasks:[
{skill:'Listening',prompt:'Understand a short message about changed plans.'},{skill:'Reading',prompt:'Read an everyday message and identify its main points.'},{skill:'Writing',prompt:'Write a short message explaining a change of plans.'},{skill:'Speaking',prompt:'Describe a recent trip and answer follow-up questions.'}]},
{id:'B1',target:900,stories:45,description:'Handle travel situations and narrate experiences with connected language.',tasks:[
{skill:'Listening',prompt:'Follow the main points of clear speech on familiar topics.'},{skill:'Reading',prompt:'Read a longer personal account and infer its main message.'},{skill:'Writing',prompt:'Write a connected account of an experience with reasons.'},{skill:'Speaking',prompt:'Describe a problem, propose a solution, and justify your choice.'}]},
{id:'B2',target:2000,stories:85,description:'Discuss abstract topics and defend viewpoints with fluency.',tasks:[
{skill:'Listening',prompt:'Understand a sustained discussion with competing viewpoints.'},{skill:'Reading',prompt:'Analyze a complex article and distinguish arguments.'},{skill:'Writing',prompt:'Write a structured opinion essay with evidence.'},{skill:'Speaking',prompt:'Debate an unfamiliar issue and respond to objections.'}]},
{id:'C1',target:4000,stories:140,description:'Express nuanced ideas flexibly in academic and professional settings.',tasks:[
{skill:'Listening',prompt:'Infer implied meaning in extended natural speech.'},{skill:'Reading',prompt:'Synthesize dense texts with nuanced viewpoints.'},{skill:'Writing',prompt:'Produce a cohesive analytical report for a defined audience.'},{skill:'Speaking',prompt:'Present and defend a nuanced argument with precision.'}]}
];
