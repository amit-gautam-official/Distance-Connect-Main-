import Ably from 'ably';

const ably = new Ably.Realtime("Xphn1Q.1vfpXQ:90QVzHTkvbeCzVD0JtAmglHP_Q11xwkAfoRjhh6JE94");

export const getAblyChannel = (channelName: string) => {
  return ably.channels.get(channelName);
};