import React from 'react';
import InstagramLayout from '../layouts/InstagramLayout';
import { InstagramFeed, InstagramMedia } from '@wix/headless-instagram/react';
import { MediaGallery } from '@wix/headless-media/react';
import { type InstagramFeedServiceConfig } from '@wix/headless-instagram/services';

export default function IndexPage(props: {
  instagramConfig: InstagramFeedServiceConfig;
}) {
  const { instagramConfig } = props;

  return (
    <InstagramLayout>
      <div>
        <h1>Instagram Headless Components Demo</h1>
        <p>
          Complete showcase of Instagram headless components integrated with
          MediaGallery from @wix/headless-media/react
        </p>

        <InstagramFeed.Root instagramFeedServiceConfig={instagramConfig}>
          {/* Feed-level components */}
          <div>
            <h2>Feed Information</h2>
            <div>
              <label>Title:</label>
              <InstagramFeed.Title />
            </div>
            <div>
              <label>Username:</label>
              <InstagramFeed.UserName />
            </div>
            <div>
              <label>Hashtag:</label>
              <InstagramFeed.Hashtag />
            </div>
          </div>

          {/* All Media Thumbnails Section */}
          <div>
            <h2>All Media Thumbnails</h2>
            <p
              style={{
                fontSize: '12px',
                color: '#666',
                marginBottom: '8px',
              }}
            >
              Custom Instagram thumbnails for all media items
            </p>
            <InstagramFeed.InstagramMedias>
              <div
                style={{
                  border: '2px solid #007acc',
                  padding: '16px',
                  borderRadius: '8px',
                }}
              >
                <h4>Instagram Media Thumbnails</h4>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '8px',
                  }}
                >
                  Each Instagram post as a thumbnail (custom implementation)
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <InstagramFeed.InstagramMediaRepeater>
                    <div
                      style={{
                        aspectRatio: '1',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.borderColor = '#007acc';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = '#ddd';
                      }}
                    >
                      <InstagramMedia.MediaGalleries>
                        <InstagramMedia.MediaGalleryRepeater>
                          <MediaGallery.Viewport>
                            {({ src, alt }) => (
                              <img
                                src={src}
                                alt={alt}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            )}
                          </MediaGallery.Viewport>
                        </InstagramMedia.MediaGalleryRepeater>
                      </InstagramMedia.MediaGalleries>

                      {/* Media type indicator */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                        }}
                      >
                        <InstagramMedia.MediaType />
                      </div>
                    </div>
                  </InstagramFeed.InstagramMediaRepeater>
                </div>
              </div>
            </InstagramFeed.InstagramMedias>
          </div>

          {/* Individual Media Viewports - One for Each Media */}
          <div style={{ marginTop: '32px' }}>
            <h2>Individual Media Viewports</h2>
            <p
              style={{
                fontSize: '12px',
                color: '#666',
                marginBottom: '16px',
              }}
            >
              Each media item with its own viewport and details
            </p>
            <InstagramFeed.InstagramMedias>
              <InstagramFeed.InstagramMediaRepeater>
                <div
                  style={{
                    border: '1px solid #ccc',
                    margin: '10px',
                    padding: '10px',
                  }}
                >
                  <h3>Media Item</h3>

                  {/* Media Viewport for this specific media */}
                  <div>
                    <h4>Media Viewer</h4>
                    <InstagramMedia.MediaGalleries>
                      <InstagramMedia.MediaGalleryRepeater>
                        <div
                          style={{
                            position: 'relative',
                            aspectRatio: '1',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #ddd',
                            marginBottom: '16px',
                          }}
                        >
                          <MediaGallery.Viewport>
                            {({ src, alt }) => (
                              <img
                                src={src}
                                alt={alt}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                            )}
                          </MediaGallery.Viewport>
                          <MediaGallery.Previous />
                          <MediaGallery.Next />
                          <MediaGallery.Indicator />
                        </div>
                      </InstagramMedia.MediaGalleryRepeater>
                    </InstagramMedia.MediaGalleries>
                  </div>

                  {/* Media details */}
                  <div>
                    <div>
                      <label>Caption:</label>
                      <InstagramMedia.Caption />
                    </div>
                    <div>
                      <label>Media Type:</label>
                      <InstagramMedia.MediaType />
                    </div>
                    <div>
                      <label>User Name:</label>
                      <InstagramMedia.UserName />
                    </div>
                    <div>
                      <label>Timestamp:</label>
                      <InstagramMedia.Timestamp />
                    </div>
                  </div>
                </div>
              </InstagramFeed.InstagramMediaRepeater>
            </InstagramFeed.InstagramMedias>
          </div>
        </InstagramFeed.Root>
      </div>
    </InstagramLayout>
  );
}
