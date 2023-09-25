import React from 'react';
import { Form, Button, Card, Col, Row } from 'react-bootstrap';

export default function TopicCard({ topic, handleRemoveButton, handleLabelChange, handleURLChange, handleAddChildButton, topics }) {
    return (
        <Card key={topic.id} style={{ width: '30' }} className="mt-3">
            <Card.Body>
                <Button
                    variant="outline-danger"
                    onClick={() => handleRemoveButton(topic.id)}
                    className="position-absolute btn-sm top-0 end-0 mt-2 me-2"
                >
                    X
                </Button>
                Topic:
                <Form.Group as={Row} className="mb-3 mt-4">
                    <Form.Label style={{ textAlign: 'right' }} column sm="2">
                        Label:
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="text"
                            placeholder="Enter label:"
                            value={topic.label}
                            onChange={(e) => handleLabelChange(e, topic.id)}
                            style={{ textAlign: 'left' }}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label style={{ textAlign: 'right' }} column sm="2">
                        URL:
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control
                            type="text"
                            placeholder="Enter URL:"
                            onChange={(e) => handleURLChange(e, topic.id)}
                            value={topic.url}
                        />
                    </Col>
                </Form.Group>
                <div>
                    {topic.childIds === null ? (
                        []
                    ) : (
                        topic.childIds.map((childId) => {
                            const childTopic = topics.find((t) => t.id === childId);
                            if (childTopic) {
                                return (
                                    <TopicCard
                                        key={childTopic.id}
                                        topic={childTopic}
                                        handleRemoveButton={handleRemoveButton}
                                        handleLabelChange={handleLabelChange}
                                        handleURLChange={handleURLChange}
                                        handleAddChildButton={handleAddChildButton}
                                        topics={topics}
                                    />
                                );
                            }
                            return null;
                        })
                    )}
                    <div className="text-end mt-2">
                        {topic.childIds !== null && (
                            <Button onClick={() => handleAddChildButton(topic.id)} style={{ align: 'right' }}>
                                Add Child
                            </Button>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
