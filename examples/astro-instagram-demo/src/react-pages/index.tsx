import React from 'react';
import InstagramLayout from '../layouts/InstagramLayout';
import { InstagramFeed, InstagramMedia } from '@wix/headless-instagram/react';
import { MediaGallery } from '@wix/headless-media/react';
import { type InstagramFeedServiceConfig } from '@wix/headless-instagram/services';

function PostThumbnailsSection() {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3>📸 All Posts Thumbnails</h3>
      <InstagramFeed.MediaGallery>
        <MediaGallery.Thumbnails>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '12px',
              padding: '16px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <MediaGallery.ThumbnailRepeater>
              <MediaGallery.ThumbnailItem asChild>
                {({ src, alt, isActive, select }) => (
                  <img
                    src={src}
                    alt={alt}
                    onClick={select}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '8px',
                      border: isActive ? '3px solid #007acc' : '2px solid #ddd',
                      cursor: 'pointer',
                      objectFit: 'cover',
                      transition: 'all 0.2s ease',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                )}
              </MediaGallery.ThumbnailItem>
            </MediaGallery.ThumbnailRepeater>
          </div>
        </MediaGallery.Thumbnails>
      </InstagramFeed.MediaGallery>
    </div>
  );
}

function FullViewModeSection() {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h3>🔍 Full View Mode - Posts & Carousel Navigation</h3>
      <InstagramFeed.InstagramMedias>
        <InstagramFeed.InstagramMediaRepeater>
          <InstagramFeed.MediaGallery>
            <div
              style={{
                display: 'flex',
                gap: '24px',
                padding: '20px',
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              {/* Left side: Full size image */}
              <div style={{ flex: '0 0 500px' }}>
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <MediaGallery.Viewport asChild>
                    {({ src, alt }) => (
                      <img
                        src={src}
                        alt={alt}
                        style={{
                          width: '100%',
                          height: '500px',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </MediaGallery.Viewport>

                  {/* Post Navigation Arrows (between posts only) */}
                  <MediaGallery.Previous
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    ←
                  </MediaGallery.Previous>
                  <MediaGallery.Next
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    →
                  </MediaGallery.Next>
                </div>

                {/* Carousel Navigation (if current post is carousel) */}
                <InstagramMedia.MediaGalleries>
                  <InstagramMedia.MediaGalleryRepeater>
                    <div style={{ marginTop: '16px' }}>
                      <h5
                        style={{
                          margin: '0 0 12px 0',
                          color: '#666',
                          textAlign: 'center',
                        }}
                      >
                        📷 Carousel Images
                      </h5>
                      <InstagramMedia.MediaGallery>
                        {/* Carousel Viewport */}
                        <div
                          style={{
                            position: 'relative',
                            marginBottom: '12px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '2px solid #007acc',
                          }}
                        >
                          <MediaGallery.Viewport asChild>
                            {({ src, alt }) => (
                              <img
                                src={src}
                                alt={alt}
                                style={{
                                  width: '100%',
                                  height: '250px',
                                  objectFit: 'cover',
                                }}
                              />
                            )}
                          </MediaGallery.Viewport>

                          {/* Carousel navigation arrows */}
                          <MediaGallery.Previous
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(0,123,204,0.8)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            ←
                          </MediaGallery.Previous>
                          <MediaGallery.Next
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              backgroundColor: 'rgba(0,123,204,0.8)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            →
                          </MediaGallery.Next>
                        </div>

                        {/* Carousel Thumbnails */}
                        <MediaGallery.Thumbnails>
                          <div
                            style={{
                              display: 'flex',
                              gap: '8px',
                              justifyContent: 'center',
                              padding: '12px',
                              backgroundColor: '#f8f9fa',
                              borderRadius: '8px',
                              border: '1px solid #ddd',
                            }}
                          >
                            <MediaGallery.ThumbnailRepeater>
                              <MediaGallery.ThumbnailItem asChild>
                                {({ src, alt, isActive, select }) => (
                                  <img
                                    src={src}
                                    alt={alt}
                                    onClick={select}
                                    style={{
                                      width: '60px',
                                      height: '60px',
                                      borderRadius: '6px',
                                      border: isActive
                                        ? '3px solid #007acc'
                                        : '2px solid #ddd',
                                      cursor: 'pointer',
                                      objectFit: 'cover',
                                      transition: 'all 0.2s ease',
                                      transform: isActive
                                        ? 'scale(1.05)'
                                        : 'scale(1)',
                                    }}
                                  />
                                )}
                              </MediaGallery.ThumbnailItem>
                            </MediaGallery.ThumbnailRepeater>
                          </div>
                        </MediaGallery.Thumbnails>
                      </InstagramMedia.MediaGallery>
                    </div>
                  </InstagramMedia.MediaGalleryRepeater>
                </InstagramMedia.MediaGalleries>
              </div>

              {/* Right side: Post data and controls */}
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    gap: '20px',
                  }}
                >
                  {/* Post Navigation Controls */}
                  <div>
                    <h5 style={{ margin: '0 0 12px 0' }}>📱 Post Navigation</h5>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <MediaGallery.Previous
                        style={{
                          padding: '10px 16px',
                          backgroundColor: '#007acc',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        ← Previous Post
                      </MediaGallery.Previous>
                      <MediaGallery.Next
                        style={{
                          padding: '10px 16px',
                          backgroundColor: '#007acc',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        Next Post →
                      </MediaGallery.Next>
                    </div>
                  </div>

                  {/* Instagram Post Data */}
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 16px 0' }}>
                      📋 Post Information
                    </h5>

                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ marginBottom: '12px' }}>
                        <strong>👤 User:</strong> <InstagramMedia.UserName />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <strong>📅 Posted:</strong> <InstagramMedia.Timestamp />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <strong>🎥 Type:</strong> <InstagramMedia.MediaType />
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '16px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                      }}
                    >
                      <strong>💬 Caption:</strong>
                      <div style={{ marginTop: '8px', lineHeight: '1.5' }}>
                        <InstagramMedia.Caption />
                      </div>
                    </div>
                  </div>

                  {/* Post Thumbnails Navigation */}
                  <div>
                    <h6 style={{ margin: '0 0 8px 0', color: '#666' }}>
                      All Posts:
                    </h6>
                    <MediaGallery.Thumbnails>
                      <div
                        style={{
                          display: 'flex',
                          gap: '6px',
                          overflowX: 'auto',
                          padding: '8px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '6px',
                          maxWidth: '100%',
                        }}
                      >
                        <MediaGallery.ThumbnailRepeater>
                          <MediaGallery.ThumbnailItem asChild>
                            {({ src, alt, isActive, select }) => (
                              <img
                                src={src}
                                alt={alt}
                                onClick={select}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '4px',
                                  border: isActive
                                    ? '2px solid #28a745'
                                    : '1px solid #ccc',
                                  cursor: 'pointer',
                                  objectFit: 'cover',
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </MediaGallery.ThumbnailItem>
                        </MediaGallery.ThumbnailRepeater>
                      </div>
                    </MediaGallery.Thumbnails>
                  </div>
                </div>
              </div>
            </div>
          </InstagramFeed.MediaGallery>
        </InstagramFeed.InstagramMediaRepeater>
      </InstagramFeed.InstagramMedias>
    </div>
  );
}

export default function IndexPage(props: {
  instagramConfig: InstagramFeedServiceConfig;
}) {
  const { instagramConfig } = props;

  return (
    <InstagramLayout>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
          📸 Instagram Headless Components Demo
        </h1>

        <InstagramFeed.Root instagramFeedServiceConfig={instagramConfig}>
          {/* Feed Header */}
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '32px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ margin: '0 0 16px 0' }}>📱 Instagram Feed Info</h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <strong>📝 Title:</strong> <InstagramFeed.Title />
              </div>
              <div>
                <strong>👤 Username:</strong> @<InstagramFeed.UserName />
              </div>
              <div>
                <strong>#️⃣ Hashtag:</strong> <InstagramFeed.Hashtag />
              </div>
            </div>
          </div>

          {/* Section 1: All Posts Thumbnails */}
          <PostThumbnailsSection />

          {/* Section 2: Full View Mode */}
          <FullViewModeSection />
        </InstagramFeed.Root>
      </div>
    </InstagramLayout>
  );
}
