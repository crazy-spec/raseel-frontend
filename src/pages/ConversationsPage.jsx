import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ComingSoonState from '../components/ui/ComingSoonState';
import api from '../services/api';

export default function ConversationsPage() {
  var appContext = useApp();
  var business = appContext.activeBusiness;
  var convosState = useState([]);
  var conversations = convosState[0];
  var setConversations = convosState[1];
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  var selectedState = useState(null);
  var selectedConvo = selectedState[0];
  var setSelectedConvo = selectedState[1];
  var msgsState = useState([]);
  var messages = msgsState[0];
  var setMessages = msgsState[1];
  var msgsLoadingState = useState(false);
  var msgsLoading = msgsLoadingState[0];
  var setMsgsLoading = msgsLoadingState[1];

  useEffect(
    function () {
      if (business && business.id) {
        setLoading(true);
        api
          .get('/conversations/history/' + business.id)
          .then(function (res) {
            setConversations(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
          })
          .catch(function () {
            setConversations([]);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    },
    [business ? business.id : null]
  );

  var openConversation = function (convo) {
    setSelectedConvo(convo);
    setMsgsLoading(true);
    api
      .get('/conversations/messages/' + convo.id)
      .then(function (res) {
        setMessages(Array.isArray(res.data) ? res.data : []);
        setMsgsLoading(false);
      })
      .catch(function () {
        setMessages([]);
        setMsgsLoading(false);
      });
  };

  var formatDate = function (d) {
    return d ? new Date(d).toLocaleDateString('en-SA') : '';
  };
  var formatTime = function (d) {
    return d
      ? new Date(d).toLocaleTimeString('en-SA', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';
  };

  if (!business) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center text-gray-500'>
          <p className='text-4xl mb-3'>{'\uD83D\uDCAC'}</p>
          <p className='font-medium'>Select a business from the header</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='text-center py-20'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto'></div>
        <p className='text-gray-500 mt-3'>Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {'\uD83D\uDCAC Conversations'}
          </h1>
          <p className='text-gray-500'>
            {(business.displayName || business.name_en || '') +
              ' \u2014 WhatsApp Conversations'}
          </p>
        </div>
        <ComingSoonState
          icon={'\uD83D\uDCAC'}
          title='Conversations appear after WhatsApp connection'
          description='All WhatsApp conversations between your AI agent and customers will appear here in real-time. You can read transcripts, see AI performance, and monitor customer satisfaction.'
          requiredStep='Connect WhatsApp Business in Settings, then test with AI Agents page'
        />
      </div>
    );
  }

  return (
    <div className='h-[calc(100vh-120px)] flex gap-4'>
      {/* Conversation List */}
      <div
        className={
          (selectedConvo ? 'hidden sm:flex' : 'flex') +
          ' w-full sm:w-96 flex-col bg-white rounded-xl shadow-sm border overflow-hidden'
        }
      >
        <div className='p-4 border-b bg-gray-50'>
          <h2 className='font-bold text-gray-900'>Conversations</h2>
          <p className='text-xs text-gray-500 mt-1'>
            {conversations.length + ' total'}
          </p>
        </div>
        <div className='flex-1 overflow-y-auto'>
          {conversations.map(function (convo) {
            var isActive = selectedConvo && selectedConvo.id === convo.id;
            return (
              <button
                key={convo.id}
                onClick={function () {
                  openConversation(convo);
                }}
                className={
                  'w-full text-left p-4 border-b hover:bg-indigo-50 transition ' +
                  (isActive
                    ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                    : '')
                }
              >
                <div className='flex justify-between items-start'>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-gray-900 truncate'>
                      {convo.customer_name || 'Unknown'}
                    </p>
                    <p className='text-sm text-gray-500 truncate mt-0.5'>
                      {convo.last_message || 'No messages'}
                    </p>
                  </div>
                  <div className='text-right ml-2 flex-shrink-0'>
                    <p className='text-xs text-gray-400'>
                      {formatDate(convo.created_at)}
                    </p>
                    <span className='inline-block mt-1 bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0.5 rounded-full'>
                      {(convo.message_count || 0) + ' msgs'}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message View */}
      <div
        className={
          (!selectedConvo ? 'hidden sm:flex' : 'flex') +
          ' flex-1 flex-col bg-white rounded-xl shadow-sm border overflow-hidden'
        }
      >
        {selectedConvo ? (
          <div className='flex flex-col h-full'>
            <div className='p-4 border-b bg-gray-50 flex items-center gap-3'>
              <button
                onClick={function () {
                  setSelectedConvo(null);
                }}
                className='sm:hidden text-gray-500'
              >
                {'\u2190 Back'}
              </button>
              <div className='w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold'>
                {(selectedConvo.customer_name || '?').charAt(0)}
              </div>
              <div>
                <p className='font-bold text-gray-900'>
                  {selectedConvo.customer_name || 'Unknown'}
                </p>
                <p className='text-xs text-gray-500'>
                  {'Phone: ****' +
                    (selectedConvo.customer_phone || '').slice(-4) +
                    ' \u2022 ' +
                    (selectedConvo.status || 'active')}
                </p>
              </div>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50'>
              {msgsLoading ? (
                <div className='text-center py-12'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto'></div>
                  <p className='text-gray-400 text-sm mt-2'>
                    Loading messages...
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className='text-center py-12 text-gray-400'>
                  <p>No messages found</p>
                </div>
              ) : (
                messages.map(function (msg, i) {
                  var isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id || i}
                      className={
                        'flex ' +
                        (isUser ? 'justify-end' : 'justify-start')
                      }
                    >
                      <div
                        className={
                          'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ' +
                          (isUser
                            ? 'bg-indigo-600 text-white rounded-br-md'
                            : 'bg-white text-gray-800 shadow-sm border rounded-bl-md')
                        }
                      >
                        <p className='whitespace-pre-wrap'>{msg.content}</p>
                        <p
                          className={
                            'text-xs mt-1 ' +
                            (isUser ? 'text-indigo-200' : 'text-gray-400')
                          }
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className='p-3 border-t bg-gray-100 text-center text-sm text-gray-500'>
              {'Read-only view \u2014 Go to '}
              <a
                href='/agents'
                className='text-indigo-600 font-medium hover:underline'
              >
                AI Agents
              </a>
              {' for live chat'}
            </div>
          </div>
        ) : (
          <div className='flex-1 flex items-center justify-center text-gray-400'>
            <div className='text-center'>
              <p className='text-5xl mb-3'>{'\uD83D\uDCAC'}</p>
              <p className='font-medium'>Select a conversation</p>
              <p className='text-sm mt-1'>
                Click any conversation from the left
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
